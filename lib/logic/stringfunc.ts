// Pattern matchers for different block types
const PATTERNS = {
  CODE_START: /^```/,
  CODE_END: "```",
  HEADER: /^#/,
  QUOTE: /^>/,
  HORIZONTAL: "---",
  UNORDERED_LIST: /^[\-+\*]\s/,
  UNORDERED_NESTED: /[\-+\*]\s|\s+\d+\./,
  ORDERED_LIST: /^\d+\.\s/,
  ORDERED_NESTED: /\d+\.\s|\s[\-+\*]\s/,
  TABLE: /^\|/,
  COLLAPSIBLE: /^=[\^v]=/,
  COLLAPSIBLE_END: "=",
} as const;

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

/**
 * Determines if a line is plaintext (not a special markdown element)
 */
function isPlaintext(line: string): boolean {
  if (!line) return false;
  return (
    !line.match(PATTERNS.HEADER) &&
    !line.match(PATTERNS.QUOTE) &&
    line !== PATTERNS.HORIZONTAL &&
    !line.match(PATTERNS.UNORDERED_LIST) &&
    !line.match(PATTERNS.ORDERED_LIST) &&
    !line.match(PATTERNS.TABLE) &&
    !line.match(PATTERNS.COLLAPSIBLE) &&
    !line.match(PATTERNS.CODE_START)
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

    // Code block
    if (item.match(PATTERNS.CODE_START)) {
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => line !== PATTERNS.CODE_END,
      );
      // Check for closing backticks and skip them
      let nextIdx = i + collected.length;
      if (
        nextIdx < oldItems.length &&
        oldItems[nextIdx] === PATTERNS.CODE_END
      ) {
        i = nextIdx;
      } else {
        i = nextIdx - 1;
      }
      newItems.push(collected.join("\n"));
    } else if (item.match(PATTERNS.HEADER)) {
      // Header (single line, no collection)
      newItems.push(item);
    } else if (item.match(PATTERNS.QUOTE)) {
      // Quote block
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(PATTERNS.QUOTE),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item === PATTERNS.HORIZONTAL) {
      // Horizontal line
      newItems.push(PATTERNS.HORIZONTAL);
    } else if (item.match(PATTERNS.UNORDERED_LIST)) {
      // Unordered list
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(PATTERNS.UNORDERED_NESTED),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(PATTERNS.ORDERED_LIST)) {
      // Ordered list
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(PATTERNS.ORDERED_NESTED),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(PATTERNS.TABLE)) {
      // Table
      const collected = collectConsecutiveLines(
        oldItems,
        i,
        (line) => !!line.match(PATTERNS.TABLE),
      );
      i += collected.length - 1;
      newItems.push(collected.join("\n"));
    } else if (item.match(PATTERNS.COLLAPSIBLE)) {
      // Collapsible system (special nesting logic)
      const collected = [item];
      let queue = 0;
      let j = i + 1;

      while (j < oldItems.length) {
        if (oldItems[j].match(PATTERNS.COLLAPSIBLE)) queue++;
        if (oldItems[j] === PATTERNS.COLLAPSIBLE_END) {
          queue--;
          if (queue < 0) break;
        }
        collected.push(oldItems[j]);
        j++;
      }

      i = j;
      newItems.push(collected.join("\n"));
    } else {
      // Plain text - collect consecutive plaintext lines
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
