/**
 * Pattern matchers for identifying markdown element types
 */
export const MARKDOWN_PATTERNS = {
  CODE_BLOCK: /^```/,
  CODE_END: "```",
  HEADER: /^#/,
  QUOTE: /^>/,
  HORIZONTAL_LINE: "---",
  UNORDERED_LIST: /^[\-+\*]\s/,
  UNORDERED_NESTED: /[\-+\*]\s|\s+\d+\./,
  ORDERED_LIST: /^\d+\./,
  ORDERED_NESTED: /\d+\.\s|\s[\-+\*]\s/,
  TABLE: /^\|/,
  COLLAPSIBLE: /^=[\^v]=/,
  COLLAPSIBLE_END: "=",
} as const;

export function isCodeBlock(content: string): boolean {
  return content.startsWith("```");
}

export function isHeader(content: string): boolean {
  return content[0] === "#";
}

export function isQuote(content: string): boolean {
  return content[0] === ">";
}

export function isHorizontalLine(content: string): boolean {
  return content === "---";
}

export function isUnorderedList(content: string): boolean {
  return !!content.match(MARKDOWN_PATTERNS.UNORDERED_LIST);
}

export function isOrderedList(content: string): boolean {
  return !!content.match(MARKDOWN_PATTERNS.ORDERED_LIST);
}

export function isTable(content: string): boolean {
  return content.startsWith("|");
}

export function isCollapsible(content: string): boolean {
  return !!content.match(MARKDOWN_PATTERNS.COLLAPSIBLE);
}
