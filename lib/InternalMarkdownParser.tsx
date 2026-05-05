import { ReactNode } from "react";
import { CodeViewer } from "./CodeViewer";
import { InlineMD } from "./InlineMarkdown";
import { MathDisplay } from "./MathDisplay";
import { MermaidDisplay } from "./MermaidDisplay";
import { SanitizedHTML } from "./SanitizedHTML";
import { semanticDiffuser } from "./stringfunc";
import { DisplayTable } from "./DisplayTable";

export function InternalTopLevelMarkdownParser({
  a,
  inline,
}: {
  a: string;
  inline: boolean;
}): ReactNode {
  // Helper functions for rendering list items with indentation support
  const renderULItems = (
    linesToProcess: string[],
    minIndent: number,
  ): ReactNode[] => {
    const items: ReactNode[] = [];
    let i = 0;

    while (i < linesToProcess.length) {
      const line = linesToProcess[i];
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;

      if (indent !== minIndent) {
        i++;
        continue;
      }

      const content = line.slice(indent + 2);
      const nestedLines: string[] = [];
      let j = i + 1;

      while (j < linesToProcess.length) {
        const nextIndent = linesToProcess[j].match(/^(\s*)/)?.[1].length ?? 0;
        if (nextIndent <= minIndent) break;
        nestedLines.push(linesToProcess[j]);
        j++;
      }

      items.push(
        <li key={i}>
          <InternalTopLevelMarkdownParser a={content} inline={true} />
          {nestedLines.length > 0 && nestedLines[0].match(/[\-+\*]\s/) && (
            <ul>{renderULItems(nestedLines, minIndent + 2)}</ul>
          )}
          {nestedLines.length > 0 && nestedLines[0].match(/\d+\./) && (
            <ol>{renderOLItems(nestedLines, minIndent + 2)}</ol>
          )}
        </li>,
      );

      i = j;
    }

    return items;
  };

  const renderOLItems = (
    linesToProcess: string[],
    minIndent: number,
  ): ReactNode[] => {
    const items: ReactNode[] = [];
    let i = 0;

    while (i < linesToProcess.length) {
      const line = linesToProcess[i];
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;

      if (indent !== minIndent) {
        i++;
        continue;
      }

      const content = line.slice(indent).replace(/^\d+\.\s/, "");
      const nestedLines: string[] = [];
      let j = i + 1;

      while (j < linesToProcess.length) {
        const nextIndent = linesToProcess[j].match(/^(\s*)/)?.[1].length ?? 0;
        if (nextIndent <= minIndent) break;
        nestedLines.push(linesToProcess[j]);
        j++;
      }

      items.push(
        <li key={i}>
          <InternalTopLevelMarkdownParser a={content} inline={true} />
          {nestedLines.length > 0 && nestedLines[0].match(/[\-+\*]\s/) && (
            <ul>{renderULItems(nestedLines, minIndent + 2)}</ul>
          )}
          {nestedLines.length > 0 && nestedLines[0].match(/\d+\./) && (
            <ol>{renderOLItems(nestedLines, minIndent + 2)}</ol>
          )}
        </li>,
      );

      i = j;
    }

    return items;
  };

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
