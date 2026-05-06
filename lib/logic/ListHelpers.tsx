import { ReactNode } from "react";
import { InternalTopLevelMarkdownParser } from "./InternalMarkdownParser";

type ListType = "ul" | "ol";

function renderListItems(
  linesToProcess: string[],
  minIndent: number,
  listType: ListType,
): ReactNode[] {
  const items: ReactNode[] = [];
  let i = 0;

  const extractContent = (line: string, indent: number): string => {
    if (listType === "ul") {
      return line.slice(indent + 2);
    } else {
      return line.slice(indent).replace(/^\d+\.\s/, "");
    }
  };

  const renderNested = (nestedLines: string[]): ReactNode => {
    if (nestedLines.length === 0) return null;
    const firstMarker = nestedLines[0];

    if (firstMarker.match(/[\-+\*]\s/)) {
      return <ul>{renderListItems(nestedLines, minIndent + 2, "ul")}</ul>;
    }
    if (firstMarker.match(/\d+\./)) {
      return <ol>{renderListItems(nestedLines, minIndent + 2, "ol")}</ol>;
    }
    return null;
  };

  while (i < linesToProcess.length) {
    const line = linesToProcess[i];
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;

    if (indent !== minIndent) {
      i++;
      continue;
    }

    const content = extractContent(line, indent);
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
        {renderNested(nestedLines)}
      </li>,
    );

    i = j;
  }

  return items;
}

export const renderULItems = (lines: string[], indent: number) =>
  renderListItems(lines, indent, "ul");

export const renderOLItems = (lines: string[], indent: number) =>
  renderListItems(lines, indent, "ol");
