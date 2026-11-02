const crypto = require("crypto");

const CATEGORIES = [
  "AC Repair",
  "Electrician",
  "Plumber",
  "Babysitting",
  "Installation",
  "Fridge Repair",
  "Solar Installation",
  "Painting",
  "Generator Repair",
  "Cleaning",
  "Cooking Assistance",
  "Carpentry",
];

// Prompt version is part of the cache key: a prompt change is a behaviour
// change, so bumping this invalidates its own cached predictions rather than
// serving results computed under an older contract.
const PROMPT_VERSION = "v1";

const CACHE_TTL_MS = parseInt(process.env.CACHE_TTL_MS || String(24 * 60 * 60 * 1000), 10);
const CACHE_MAX_ENTRIES = parseInt(process.env.CACHE_MAX_ENTRIES || "5000", 10);

// Keyword fallback. Used when the model is unavailable, times out, or returns
// something outside the taxonomy. Lower accuracy than the model, but it keeps
// the feature answering instead of failing.
const KEYWORDS = {
  "AC Repair": ["ac", "air condition", "aircon", "cooling", "split unit"],
  Electrician: ["electric", "wiring", "socket", "light", "power", "switch", "fuse", "meter"],
  Plumber: ["plumb", "pipe", "leak", "tap", "toilet", "drain", "water", "sink", "borehole"],
  Babysitting: ["babysit", "nanny", "childcare", "child care", "baby", "creche"],
  Installation: ["install", "mount", "setup", "set up", "fix up", "dstv", "dish", "tv"],
  "Fridge Repair": ["fridge", "freezer", "refrigerat", "cold room"],
  "Solar Installation": ["solar", "inverter", "panel", "battery"],
  Painting: ["paint", "wall", "screed", "emulsion", "pop"],
  "Generator Repair": ["generator", "gen ", "mikano", "elepaq", "servicing gen"],
  Cleaning: ["clean", "wash", "fumigat", "laundry", "maid", "housekeep", "tidy"],
  "Cooking Assistance": ["cook", "chef", "kitchen", "meal", "food prep"],
  Carpentry: ["carpent", "wood", "furniture", "door", "cabinet", "wardrobe", "roof"],
};

function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cacheKey(text) {
  return crypto
    .createHash("sha256")
    .update(`${PROMPT_VERSION}:${normalise(text)}`)
    .digest("hex");
}

/**
 * The model is asked for one of a fixed set of categories, but nothing stops
 * it returning something else. Anything outside the taxonomy is treated as a
 * model failure rather than passed downstream as a category.
 */
function validate(prediction) {
  if (!prediction || typeof prediction !== "string") return null;

  const cleaned = prediction
    .trim()
    .replace(/^["'`]+|["'`.]+$/g, "")
    .replace(/^service:\s*/i, "")
    .trim();

  const exact = CATEGORIES.find((c) => c.toLowerCase() === cleaned.toLowerCase());
  if (exact) return exact;

  // Tolerate a category returned inside a longer sentence, but only when
  // exactly one category matches — an ambiguous response is a failure.
  const contained = CATEGORIES.filter((c) => cleaned.toLowerCase().includes(c.toLowerCase()));
  if (contained.length === 1) return contained[0];

  return null;
}

function classifyByKeyword(text) {
  const t = normalise(text);
  if (!t) return null;

  let best = null;
  let bestScore = 0;

  for (const [category, words] of Object.entries(KEYWORDS)) {
    const score = words.reduce((n, w) => (t.includes(w) ? n + 1 : n), 0);
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  return bestScore > 0 ? best : null;
}

// --- Cache -----------------------------------------------------------------
// In-memory, TTL'd, size-capped. The service is stateless and the taxonomy is
// small, so this stays cheap; it is not shared across instances by design.

const cache = new Map();
const stats = { hits: 0, misses: 0, modelCalls: 0, fallbacks: 0, validationFailures: 0 };

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  // Refresh recency for the LRU eviction below.
  cache.delete(key);
  cache.set(key, entry);
  return entry.category;
}

function cacheSet(key, category) {
  if (cache.size >= CACHE_MAX_ENTRIES) {
    // Map preserves insertion order, so the first key is the least recently used.
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, { category, at: Date.now() });
}

module.exports = {
  CATEGORIES,
  PROMPT_VERSION,
  normalise,
  cacheKey,
  validate,
  classifyByKeyword,
  cacheGet,
  cacheSet,
  cacheSize: () => cache.size,
  stats,
};
