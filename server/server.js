const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const path = require("path");

const { getChatResponse } = require("./services/llmService");
const quizRoute = require("./routes/quiz"); // ✅ moved above

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Store parsed content globally
let pdfContent = "";

// ✅ PDF Upload + Summary
app.post("/api/pdf/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const dataBuffer = fs.readFileSync(req.file.path);
  try {
    const data = await pdf(dataBuffer);
    pdfContent = data.text.slice(0, 8000); // Keep within context limit

    const summary = await getChatResponse(`Summarize this PDF content:\n\n${pdfContent}`);
    fs.unlinkSync(req.file.path); // delete temp file

    res.json({ text: pdfContent, summary });
  } catch (err) {
    res.status(500).json({ error: "Failed to parse PDF" });
  }
});

// ✅ Chat with PDF
app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  if (!pdfContent) return res.status(400).json({ error: "No PDF uploaded yet." });

  const prompt = `You are an AI answering questions based on this PDF content:
"""
${pdfContent}
"""
Question: ${question}
Answer:`;

  try {
    const answer = await getChatResponse(prompt);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get response" });
  }
});

// ✅ Mount quiz route
app.use("/api/quiz", quizRoute);

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
