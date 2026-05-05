import { semanticDiffuser } from "./stringfunc";
import "./defaults.css";
import { InternalTopLevelMarkdownParser } from "./InternalMarkdownParser";

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
 * @param param0 
 * @returns 
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


