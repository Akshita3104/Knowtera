import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function Chats({ pdfText }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("https://knowtera.onrender.com/api/chat", { question });
      setAnswer(res.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Error: Failed to get a response.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Ask a Question About the PDF</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
      />
      <button onClick={handleAsk}>Ask</button>

      {loading && <p>Thinking...</p>}
      {answer && (
        <div>
          <h4>Answer:</h4>
          <div className="markdown-box">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
