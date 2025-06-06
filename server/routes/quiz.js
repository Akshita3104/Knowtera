const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../services/llmService");
const { generateQuizPrompt } = require("../services/quizUtils");

router.post("/", async (req, res) => {
  const { pdfText } = req.body;

  if (!pdfText) return res.status(400).json({ error: "Missing PDF content" });

  const prompt = generateQuizPrompt(pdfText);

  try {
    const response = await getChatResponse(prompt);
    res.json({ quiz: response });
  } catch (err) {
    console.error("Quiz generation error:", err.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

module.exports = router;