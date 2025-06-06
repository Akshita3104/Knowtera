// routes/chat.js
const express = require("express");
const router = express.Router();
const { getChatResponse } = require("../services/llmService");

router.post("/", async (req, res) => {
  const { message, pdfText } = req.body;

  if (!message || !pdfText) {
    return res.status(400).json({ error: "Missing message or PDF text" });
  }

  try {
    const prompt = `You are an assistant that reads the following document and answers questions based on it.\n\nDocument content:\n${pdfText}\n\nQuestion: ${message}\n\nAnswer clearly and concisely.`;
    const response = await getChatResponse(prompt);
    res.json({ response });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Failed to get chat response" });
  }
});

module.exports = router;
