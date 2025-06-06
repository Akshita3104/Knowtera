// server/services/llmService.js
const axios = require("axios");
require("dotenv").config();

async function getChatResponse(prompt) {
  try {
    const res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "meta-llama/llama-4-maverick-17b-128e-instruct", // ← updated model
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);
    throw new Error("Failed to get response from Groq API");
  }
}

module.exports = { getChatResponse };
