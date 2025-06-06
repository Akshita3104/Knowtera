import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/PdfUploader.css";

export default function PdfUploader({ setPdfText }) {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/pdf/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPdfText(data.text);
    setSummary(data.summary);
  };

  return (
    <div className="pdf-uploader">
      <h2>Upload PDF & Summarize</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Get Summary</button>

      {summary && (
        <>
          <h3>Summary:</h3>
          <div className="markdown-box">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </>
      )}
    </div>
  );
}
