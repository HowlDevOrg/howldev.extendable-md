import { MARKDOWN_PATTERNS } from "./MarkdownPatterns";

/**
 * Collects consecutive lines matching a predicate from startIndex.
 * Returns the collected lines and updates the index via the closure.
 */
function collectConsecutiveLines(
  items: string[],
  startIndex: number,
  predicate: (line: string) => boolean,
): string[] {
  const collected = [items[startIndex]];
  let i = startIndex + 1;

  while (i < items.length && predicate(items[i])) {
    collected.push(items[i]);
    i++;
  }

  return collected;
}

function isPlaintext(line: string): boolean {
  if (!line) return false;
  return (
    !line.match(MARKDOWN_PATTERNS.HEADER) &&
    !line.match(MARKDOWN_PATTERNS.QUOTE) &&
    line !== MARKDOWN_PATTERNS.HORIZONTAL_LINE &&
    !line.match(MARKDOWN_PATTERNS.UNORDERED_LIST) &&
    !line.match(MARKDOWN_PATTERNS.ORDERED_LIST) &&
    !line.match(MARKDOWN_PATTERNS.TABLE) &&
    !line.match(MARKDOWN_PATTERNS.COLLAPSIBLE) &&
    !line.match(MARKDOWN_PATTERNS.CODE_BLOCK)
  );
}

/**
 * Takes in a blob of text and parses with respect to code blocks,
 * block quotes, headers, horizontal lines, images, ol, and ul.
 * @param items The text to parse (split by \n)
 * @returns Split items according to semantics
 */
export function semanticDiffuser(items: string): string[] {
  const oldItems: string[] = items.split("\n").map((a) => a.trimEnd());
  const newItems: string[] = [];

  for (let i = 0; i < oldItems.length; i++) {
    const item = oldItems[i];
    if (!item) continue;

    if (item.match(MARKDOWN_PATTERNS.CODE_BLOCK)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => line !== MARKDOWN_PATTERNS.CODE_END,
      );
      let nextIdx = i + collected.length;
      if (
        nextIdx < oldItems.length &&
        oldItems[nextIdx] === MARKDOWN_PATTERNS.CODE_END
      ) {
        i = nextIdx;
      } else {
        i = nextIdx - 1;
      }
      newItems.push(collected.join("\n"));
    } else if (item.match(MARKDOWN_PATTERNS.HEADER)) {
      newItems.push(item);
    } else if (item.match(MARKDOWN_PATTERNS.QUOTE)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(MARKDOWN_PATTERNS.QUOTE),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item === MARKDOWN_PATTERNS.HORIZONTAL_LINE) {
      newItems.push(MARKDOWN_PATTERNS.HORIZONTAL_LINE);
    } else if (item.match(MARKDOWN_PATTERNS.UNORDERED_LIST)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(MARKDOWN_PATTERNS.UNORDERED_NESTED),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(MARKDOWN_PATTERNS.ORDERED_LIST)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(MARKDOWN_PATTERNS.ORDERED_NESTED),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(MARKDOWN_PATTERNS.TABLE)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(MARKDOWN_PATTERNS.TABLE),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(MARKDOWN_PATTERNS.COLLAPSIBLE)) {
      const collected = [item];
      let queue = 0;
      let j = i + 1;

      while (j < oldItems.length) {
        if (oldItems[j].match(MARKDOWN_PATTERNS.COLLAPSIBLE)) queue++;
        if (oldItems[j] === MARKDOWN_PATTERNS.COLLAPSIBLE_END) {
          queue--;
          if (queue < 0) break;
        }
        collected.push(oldItems[j]);
        j++;
      }

      i = j;
      newItems.push(collected.join("\n"));
    } else {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => isPlaintext(line),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    }
  }

  return newItems;
}
