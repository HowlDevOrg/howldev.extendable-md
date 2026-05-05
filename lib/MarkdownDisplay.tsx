import { ReactNode } from "react";
import { CodeViewer } from "./CodeViewer";
import { InlineMD } from "./InlineMarkdown";
import { MathDisplay } from "./MathDisplay";
import { MermaidDisplay } from "./MermaidDisplay";
import { SanitizedHTML } from "./SanitizedHTML";
import { semanticDiffuser } from "./stringfunc";

type Props = {
  text: string;
};

export function MarkdownDisplay({ text }: Props) {
  const items = semanticDiffuser(text);

  return (
    <div>
      {items.map((a) => (
        <InternalTopLevelMarkdownParser a={a} />
      ))}
    </div>
  );
}

function InternalTopLevelMarkdownParser({ a }: { a: string }): ReactNode {
  switch (a[0]) {
    case "`":
      const newLineItems = a.split("\n");
      const type = newLineItems[0].slice(3).trimEnd();
      if (type === "math") {
        return (
          <MathDisplay
            text={newLineItems.slice(1).join("\n")}
            displayAsBlock={true}
          />
        );
      } else if (type === "mermaid") {
        return <MermaidDisplay text={newLineItems.slice(1).join("\n")} />;
      } else {
        return (
          <CodeViewer
            langauge={type}
            codeLines={newLineItems.slice(1).join("\n")}
          />
        );
      }
    case "#":
      const spaceItems = a.split(" ");
      let headerSize = spaceItems[0].length;
      headerSize = headerSize > 6 ? 6 : headerSize;
      const output = `<h${headerSize}>${spaceItems.slice(1).join(" ")}</h${headerSize}>`;
      return <SanitizedHTML html={InlineMD(output)} />;
    case ">":
      const quoteItems = a
        .split("\n")
        .map((a) => a.slice(2))
        .join("\n");
      const newItems = semanticDiffuser(quoteItems);
      return (
        <blockquote>
          {newItems.map((a) => (
            <InternalTopLevelMarkdownParser a={a} />
          ))}
        </blockquote>
      );
    case "-":
      if (a === "---") {
        return <hr />;
      } else {
        return <p>List section</p>;
      }
    default:
      return <SanitizedHTML html={InlineMD(a)} />;
  }
}
