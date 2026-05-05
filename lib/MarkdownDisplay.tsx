import { semanticDiffuser } from "./logic/stringfunc";
import "./defaults.css";
import { InternalTopLevelMarkdownParser } from "./logic/InternalMarkdownParser";

export type Props = {
  text: string;
};

/**
 * Takes in text separated by newlines and provides: 
 * - Code display/copy/syntax highlighting
 * - Mermaid support
 * - LaTeX support (inline with $ and math code blocks)
 * - Collapsible systems (with =^= and =v=, closed with = alone on a line)
 * 
 * Everything is run through DOMPurify so you don't have to worry about scripts or whatever. 
 * @param text Text to render.
 */
export function MarkdownDisplay({ text }: Props) {
  const items = semanticDiffuser(text);

  return (
    <div id="howldev-display"> {/* This feels verbose but I do want a top-level id */}
      {items.map((a) => (
        <InternalTopLevelMarkdownParser a={a} inline={false} />
      ))}
    </div>
  );
}


