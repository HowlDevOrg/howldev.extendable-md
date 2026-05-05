import { ReactNode } from "react";
import { InternalTopLevelMarkdownParser } from "./InternalMarkdownParser";

export function renderULItems(
  linesToProcess: string[],
  minIndent: number,
): ReactNode[] {
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
}

export function renderOLItems(
  linesToProcess: string[],
  minIndent: number,
): ReactNode[] {
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
}
