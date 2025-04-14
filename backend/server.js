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

  if (!input) {
    return res.status(400).json({ error: "Input is required." });
  }

  try {
    const response = await cohere.generate({
      model: "command",
      prompt: `You are a smart assistant. Based on the user input, identify the closest matching service category from this list:\n\n${categories.join(
        ", "
      )}\n\nUser input: "${input}"\n\nMatching category:`,
      maxTokens: 20,
      temperature: 0.2,
    });

    const generationList = response?.result?.generations;
    const prediction = generationList?.[0]?.text?.trim();

    console.log("🎯 Prediction:", prediction);

    if (!prediction) {
      return res.status(400).json({ error: "AI could not classify input." });
    }

    res.json({ category: prediction });
  } catch (err) {
    console.error("🔥 Cohere FULL error:", err);
    res.status(500).json({ error: "Cohere classification failed." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Cohere backend running on port ${PORT}`);
});
