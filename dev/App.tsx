import { useState } from "react";
import { MarkdownDisplay } from "../lib/MarkdownDisplay.js";
import "./App.css";

export function App() {
  const [text, setText] = useState("");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter markdown here..."
        style={{
          flex: 1,
          padding: "16px",
          fontSize: "16px",
          border: "none",
          fontFamily: "monospace",
        }}
      />
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          borderLeft: "1px solid #ccc",
        }}
      >
        <MarkdownDisplay text={text} />
      </div>
    </div>
  );
}
