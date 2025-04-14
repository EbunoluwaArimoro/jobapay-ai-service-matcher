const express = require("express");
const cors = require("cors");
const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const categories = [
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

app.post("/classify", async (req, res) => {
  const { input } = req.body;

  const prompt = `
Given the user's request, classify it into one of these categories:
${categories.join(", ")}

Only return the exact category name. No explanation.

User: "${input}"
Category:
  `;

  try {
    const response = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 10,
      temperature: 0,
    });

    const prediction = response.generations[0]?.text.trim();
    console.log("🎯 Cohere predicted:", prediction);
    res.json({ category: prediction });
  } catch (err) {
    console.error("🔥 Cohere Error:", err.message || err);
    res.status(500).json({ error: "Cohere generation failed." });
  }
});

app.listen(5000, () => {
  console.log("✅ Cohere backend (using generate) running at http://localhost:5000");
});
