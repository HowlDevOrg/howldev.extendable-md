import { createRoot } from "react-dom/client";
import { MarkdownDisplay } from "../lib/MarkdownDisplay.js";

const text: string = `Hello! This is one paragraph.

Another paragraph is here. 
`

createRoot(document.getElementById("root")!).render(
  <>
    <MarkdownDisplay text={text} />
  </>
);
