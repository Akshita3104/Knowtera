// client/src/components/QuizGenerator.js
import React, { useState } from "react";
import axios from "axios";

export default function QuizGenerator({ pdfText }) {
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://knowtera.onrender.com/api/quiz", { pdfText });
      setQuiz(res.data.quiz);
    } catch (err) {
      setQuiz("Failed to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-section">
      <h2>Generate Quiz from PDF</h2>
      <button onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
      <pre className="quiz-output">{quiz}</pre>
    </div>
  );
}
