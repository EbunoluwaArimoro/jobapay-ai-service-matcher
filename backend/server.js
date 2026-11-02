const express = require("express");
const cors = require("cors");
const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const {
  CATEGORIES,
  cacheKey,
  validate,
  classifyByKeyword,
  cacheGet,
  cacheSet,
  cacheSize,
  stats,
} = require("./classifier");

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Latency budget. Past this the model is abandoned and the keyword classifier
// answers instead — a slower correct answer is worse than a fast approximate
// one for a search box the user is waiting on.
const MODEL_TIMEOUT_MS = parseInt(process.env.MODEL_TIMEOUT_MS || "3500", 10);

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error("model timeout"), { code: "ETIMEDOUT" })), ms)
    ),
  ]);
}

/**
 * Pull the generated text out of the response. The SDK has returned this under
 * three different shapes across versions, so none of them are assumed.
 */
function extractText(response) {
  return (
    response?.generations?.[0]?.text ??
    response?.body?.generations?.[0]?.text ??
    response?.result?.generations?.[0]?.text ??
    null
  );
}

async function classifyWithModel(input) {
  const response = await withTimeout(
    cohere.generate({
      model: "command",
      prompt: `Classify the following input into one of these services:\n\n${CATEGORIES.join(
        ", "
      )}\n\nUser: "${input}"\n\nService:`,
      maxTokens: 20,
      temperature: 0.3,
    }),
    MODEL_TIMEOUT_MS
  );

  const raw = extractText(response);
  return validate(raw);
}

app.post("/classify", async (req, res) => {
  const { input } = req.body;

  if (!input || typeof input !== "string" || !input.trim()) {
    return res.status(400).json({ error: "Input is required." });
  }

  const key = cacheKey(input);

  // 1. Cache first. The model call is what happens on a miss, not the default.
  const cached = cacheGet(key);
  if (cached) {
    stats.hits += 1;
    return res.json({ category: cached, source: "cache" });
  }
  stats.misses += 1;

  // 2. Model.
  let category = null;
  try {
    stats.modelCalls += 1;
    category = await classifyWithModel(input);
    if (!category) {
      stats.validationFailures += 1;
      console.warn("Model returned a value outside the taxonomy — falling back");
    }
  } catch (err) {
    const reason = err.code === "ETIMEDOUT" ? "timeout" : err.message;
    console.warn(`Model call failed (${reason}) — falling back`);
  }

  // 3. Fallback. Degrade to keyword matching rather than failing the request.
  if (!category) {
    category = classifyByKeyword(input);
    if (category) {
      stats.fallbacks += 1;
      return res.json({ category, source: "fallback" });
    }
    return res.status(422).json({
      error: "Could not identify the service. Please be more specific.",
    });
  }

  cacheSet(key, category);
  return res.json({ category, source: "model" });
});

// Operational visibility: without this, cache effectiveness and fallback rate
// are guesses.
app.get("/health", (req, res) => {
  const total = stats.hits + stats.misses;
  res.json({
    ok: true,
    cache: {
      entries: cacheSize(),
      hits: stats.hits,
      misses: stats.misses,
      hitRate: total ? +(stats.hits / total).toFixed(3) : null,
    },
    model: {
      calls: stats.modelCalls,
      validationFailures: stats.validationFailures,
      fallbacks: stats.fallbacks,
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Cohere backend running on port ${PORT}`);
});
