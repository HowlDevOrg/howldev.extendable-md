import { ReactNode } from "react";
import { CodeViewer } from "../components/CodeViewer";
import { InlineMD } from "./InlineMarkdown";
import { MathDisplay } from "../components/MathDisplay";
import { MermaidDisplay } from "../components/MermaidDisplay";
import { SanitizedHTML } from "../components/SanitizedHTML";
import { semanticDiffuser } from "./stringfunc";
import { DisplayTable } from "../components/DisplayTable";
import { renderOLItems, renderULItems } from "./ListHelpers";
import { CollapsibleSystem } from "../components/CollapsibleSystem";
import {
  isCodeBlock,
  isHeader,
  isQuote,
  isHorizontalLine,
  isUnorderedList,
  isOrderedList,
  isTable,
  isCollapsible,
} from "./MarkdownPatterns";

export function InternalTopLevelMarkdownParser({
  a,
  inline,
}: {
  a: string;
  inline: boolean;
}): ReactNode {
  if (!a[0]) {
    return;
  } else if (isCodeBlock(a)) {
    const newLineItems = a.split("\n");
    const type = newLineItems[0].slice(3).trimEnd();
    const codeText = newLineItems.slice(1).join("\n");
    // AI: If function exists, return that instead
    return InternalCodeDisplay(type, codeText);
  } else if (isHeader(a)) {
    const spaceItems = a.split(" ");
    let headerSize = spaceItems[0].length;
    headerSize = headerSize > 6 ? 6 : headerSize;
    const output = `<h${headerSize}>${spaceItems.slice(1).join(" ")}</h${headerSize}>`;
    return <SanitizedHTML html={InlineMD(output)} />;
  } else if (isQuote(a)) {
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
  } else if (isHorizontalLine(a)) {
    return <hr />;
  } else if (isUnorderedList(a)) {
    const lines = a.split("\n");
    const baseIndent = lines[0].match(/^(\s*)/)?.[1].length ?? 0;
    return <ul>{renderULItems(lines, baseIndent)}</ul>;
  } else if (isOrderedList(a)) {
    const lines = a.split("\n");
    const baseIndent = lines[0].match(/^(\s*)/)?.[1].length ?? 0;
    return <ol>{renderOLItems(lines, baseIndent)}</ol>;
  } else if (isTable(a)) {
    return <DisplayTable text={a} />;
  } else if (isCollapsible(a)) {
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

function InternalCodeDisplay(type: string, codeText: string): ReactNode {
  if (type === "math") {
    return (
      <MathDisplay
        text={codeText}
        displayAsBlock={true}
      />
    );
  } else if (type === "mermaid") {
    return <MermaidDisplay text={codeText} />;
  } else {
    return (
      <CodeViewer
        language={type}
        codeLines={codeText}
      />
    );
  }
}