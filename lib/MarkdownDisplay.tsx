import { semanticDiffuser } from "./logic/stringfunc";
import "./defaults.css";
import { InternalTopLevelMarkdownParser } from "./logic/InternalMarkdownParser";
import { ReactNode } from "react";

type Props = {
  text: string;
  codeOverload?: (language: string, code: string, overload: (language: string, code: string) => ReactNode) => ReactNode;
  inlineOverload?: (input: string) => string;
  enableInteractiveCalculator?: boolean;
};

/**
 * Takes in text separated by newlines and provides: 
 * - Code display/copy/syntax highlighting
 * - Mermaid support
 * - LaTeX support (inline with $ and math code blocks)
 * - Collapsible systems (with =^= and =v=, closed with = alone on a line)
 * - Many (not all) markdown features (check wiki)
 * 
 * Everything is run through DOMPurify so you don't have to worry about scripts or whatever. 
 * 
 * For the optional codeOverload parameter, you can read all the code snippets coming through, and either 
 * write a custom display for yourself (or you can overwrite my styling), or just make some 
 * custom code blocks that you render differently, then pass back to my parser (last parameter) for 
 * everything else. 
 * 
 * Example: 
 * ```js
 * function ExampleCodeOverride(language: string, content: string, overload: (language: string, code: string) => ReactNode): ReactNode {
 *   if (language === "my-custom-block") {
 *     return <p className="my-block">{content}</p>
 *   } 
 *   return overload(language, content);
 * }
 * ```
 * 
 * For the optional inlineOverload parameter, this function runs before any of the built-in Regex functions. 
 * This allows you to overwrite/ignore any inline Markdown you don't like or add in a custom one, 
 * such as the \^\^text\^\^ example that might return a custom CSS class-span that you can style. 
 * 
 * Example: 
 * ```js
 * function ExampleInlineOverride(text: string): string {
 *   return text.replace(/\^\^(.+?)\^\^/g, (_, p1) => {
 *     return `<span class="new-content">${p1}</span>`;
 *   });
 * }
 * ```
 * @param text Text to render.
 * @param codeOverload Optional function to overload the CodeViewer component. 
 * @param inlineOverload Optional function to have custom inline values. 
 */
export function MarkdownDisplay({ text, codeOverload, inlineOverload, enableInteractiveCalculator = false }: Props) {
  const items = semanticDiffuser(text);

  return (
    <div id="extendable-md-container"> {/* This feels verbose but I do want a top-level id */}
      {items.map((a) => (
        <InternalTopLevelMarkdownParser a={a} inline={false} codeOverload={codeOverload} inlineOverload={inlineOverload} enableInteractiveCalculator={enableInteractiveCalculator} />
      ))}
    </div>
  );
}


