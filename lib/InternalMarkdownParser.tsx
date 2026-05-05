import { ReactNode } from "react";
import { CodeViewer } from "./CodeViewer";
import { InlineMD } from "./InlineMarkdown";
import { MathDisplay } from "./MathDisplay";
import { MermaidDisplay } from "./MermaidDisplay";
import { SanitizedHTML } from "./SanitizedHTML";
import { semanticDiffuser } from "./stringfunc";
import { DisplayTable } from "./DisplayTable";
import { renderOLItems, renderULItems } from "./ListHelpers";
import { CollapsibleSystem } from "./CollapsibleSystem";

export function InternalTopLevelMarkdownParser({
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
          language={type}
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
    const lines = a.split("\n");
    const baseIndent = lines[0].match(/^(\s*)/)?.[1].length ?? 0;
    return <ul>{renderULItems(lines, baseIndent)}</ul>;
  } else if (a.match(/^\d+\./g)) {
    const lines = a.split("\n");
    const baseIndent = lines[0].match(/^(\s*)/)?.[1].length ?? 0;
    return <ol>{renderOLItems(lines, baseIndent)}</ol>;
  } else if (a.startsWith("|")) {
    return <DisplayTable text={a} />;
  } else if (a.match(/^=[\^v]=/g)) {
    const lines = a.split("\n");
    const newSemantics = semanticDiffuser(lines.slice(1).join("\n"));
    return (
      <CollapsibleSystem
        outerComponent={
          <InternalTopLevelMarkdownParser
            a={lines[0].slice(4)}
            inline={false}
          />
        }
        defaultOpen={lines[0][1] === "v" ? true : false}
        innerComponent={newSemantics.map(a => <InternalTopLevelMarkdownParser a={a} inline={false} />)}
      />
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
