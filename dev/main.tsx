import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "katex/dist/katex.min.css";
import "highlight.js/styles/tokyo-night-dark.css";

createRoot(document.getElementById("root")!).render(<App />);
