import React, { useState } from "react";
import PdfUploader from "./components/PdfUploader";
import Chats from "./components/Chats";
import QuizGenerator from "./components/QuizGenerator";
import './styles.css';

export default function App() {
  const [pdfText, setPdfText] = useState("");
  const [activeTab, setActiveTab] = useState("upload");

  const renderComponent = () => {
    if (!pdfText && activeTab !== "upload") {
      return <div className="text-center mt-4">Upload a PDF to continue.</div>;
    }

    switch (activeTab) {
      case "upload":
        return <PdfUploader setPdfText={setPdfText} />;
      case "chat":
        return <Chats pdfText={pdfText} />;
      case "quiz":
        return <QuizGenerator pdfText={pdfText} />;

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <button onClick={() => setActiveTab("upload")}>PDF Upload</button>
        <button onClick={() => setActiveTab("chat")}>Chat</button>
        <button onClick={() => setActiveTab("quiz")}>Quiz</button>
      </nav>

      <main className="p-4">{renderComponent()}</main>
    </div>
  );
}
