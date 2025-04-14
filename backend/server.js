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
      prompt: `Classify the following input into one of these services:\n\n${categories.join(
        ", "
      )}\n\nUser: "${input}"\n\nService:`,
      maxTokens: 20,
      temperature: 0.3,
    });

    console.log("🔍 Raw Cohere response:", response);

    let prediction = "";

    // Defensive check for different possible response shapes
    if (response?.generations?.[0]?.text) {
      prediction = response.generations[0].text.trim();
    } else if (response?.body?.generations?.[0]?.text) {
      prediction = response.body.generations[0].text.trim();
    } else if (response?.result?.generations?.[0]?.text) {
      prediction = response.result.generations[0].text.trim();
    }

    if (!prediction) {
      return res.status(500).json({ error: "AI could not classify input." });
    }

    console.log("🎯 Predicted:", prediction);
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
