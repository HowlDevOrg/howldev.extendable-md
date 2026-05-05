import katex from "katex";

/**
 * Takes in an inline element and returns the text formatted with bold,
 * italics, anchor elements, strikethrough, inline code, and inline
 * Math.
 * @param input String to be modified.
 */
export function InlineMD(input: string): string {
  let rollingResult = input;

  // Newline
  rollingResult = rollingResult.replace(/\\n/g, (_, p1) => {
    return `<br/>`;
  });

  // Bold
  rollingResult = rollingResult.replace(/\*\*([^_*]+?)\*\*/g, (_, p1) => {
    return `<b>${p1}</b>`;
  });
  rollingResult = rollingResult.replace(/__([^_*]+?)__/g, (_, p1) => {
    return `<b>${p1}</b>`;
  });

  // Italic
  rollingResult = rollingResult.replace(/\*([^_*]+?)\*/g, (_, p1) => {
    return `<em>${p1}</em>`;
  });
  rollingResult = rollingResult.replace(/_([^_*]+?)_/g, (_, p1) => {
    return `<em>${p1}</em>`;
  });

  // Code
  rollingResult = rollingResult.replace(/`(.+?)`/g, (_, p1) => {
    return `<code>${p1}</code>`;
  });

  // Strikethrough
  rollingResult = rollingResult.replace(/~(.+?)~/g, (_, p1) => {
    return `<strike>${p1}</strike>`;
  });

  // Math
  rollingResult = rollingResult.replace(/\$(.+?)\$/g, (_, p1) => {
    return katex.renderToString(p1, {
      throwOnError: false,
      displayMode: false,
    });
  });

  // Anchor
  rollingResult = rollingResult.replace(/\[(.*?)\]\((.*?)\)/g, (_, p1, p2) => {
    const b: string[] = p2.split(' ');
    return `<a href="${b[0]}"${(b.length > 1 ? ` title="${b.slice(1).join(' ')}"` : "")}>${p1}</a>`
  });

  return rollingResult;
}
