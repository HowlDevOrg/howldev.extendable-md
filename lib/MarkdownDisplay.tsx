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
        <InternalTopLevelMarkdownParser a={a} inline={false} />
      ))}
    </div>
  );
}

function InternalTopLevelMarkdownParser({
  a,
  inline,
}: {
  a: string;
  inline: boolean;
}): ReactNode {
  if (!a[0]) {
    return;
  } else if (a[0] === "`") {
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
  } else if (a[0] === "#") {
    const spaceItems = a.split(" ");
    let headerSize = spaceItems[0].length;
    headerSize = headerSize > 6 ? 6 : headerSize;
    const output = `<h${headerSize}>${spaceItems.slice(1).join(" ")}</h${headerSize}>`;
    return <SanitizedHTML html={InlineMD(output)} />;
  } else if (a[0] === ">") {
    const quoteItems = a
      .split("\n")
      .map((a) => a.slice(2))
      .join("\n");
    const newItems = semanticDiffuser(quoteItems);
    return (
      <blockquote>
        {newItems.map((a) => (
          <InternalTopLevelMarkdownParser a={a} inline={false} />
        ))}
      </blockquote>
    );
  } else if (a === "---") {
    return <hr />;
  } else if (a.match(/^[\-+\*]\s/g)) {
    const ulListItems = a.split("\n").map((a) => a.slice(2));
    return (
      <ul>
        {ulListItems.map((b) => {
          if (b.match(/^[\-+\*]\s/g) || b.match(/^\d+\./g) || b === "---") {
            return <InternalTopLevelMarkdownParser a={b} inline={true} />;
          }
          return (
            <li>
              <InternalTopLevelMarkdownParser a={b} inline={true} />
            </li>
          );
        })}
      </ul>
    );
  } else if (a.match(/^\d+\./g)) {
    const olListItems = a.split("\n").map((a) => a.slice(2));
    return (
      <ol>
        {olListItems.map((b) => {
          if (b.match(/^[\-+\*]\s/g) || b.match(/^\d+\./g) || b === "---") {
            return <InternalTopLevelMarkdownParser a={b} inline={true} />;
          }
          return (
            <li>
              <InternalTopLevelMarkdownParser a={b} inline={true} />
            </li>
          );
        })}
      </ol>
    );
  } else {
    return inline ? (
      <SanitizedHTML html={InlineMD(a)} />
    ) : (
      <p>
        <SanitizedHTML html={InlineMD(a)} />
      </p>
    );
  }
}
