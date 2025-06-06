const axios = require("axios");
require("dotenv").config();

function generateQuizPrompt(pdfText) {
  return `
You are a quiz generator.

Based on the following PDF content, generate 5 multiple-choice questions. Each question should have 4 options (a, b, c, d), and clearly mention the correct answer.

Content:
"""
${pdfText}
"""

Format:
1. Question text?
a) Option 1
b) Option 2
c) Option 3
d) Option 4
Answer: b) Option 2

Only include the quiz.
`;
}

module.exports = { generateQuizPrompt };