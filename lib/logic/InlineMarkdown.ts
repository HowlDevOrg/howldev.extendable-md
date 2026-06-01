import katex from "katex";

/**
 * Takes in an inline element and returns the text formatted with bold,
 * italics, anchor elements, strikethrough, inline code, and inline
 * Math.
 * @param input String to be modified.
 * @param inlineOverload Optional function to process the input before built-in inline markdown.
 */
export function InlineMD(
  input: string,
  inlineOverload?: (input: string) => string,
): string {
  let rollingResult = input;

  if (inlineOverload) {
    rollingResult = inlineOverload(rollingResult);
  }

  // Solo link
  rollingResult = rollingResult.replace(/<http(.*)>/g, (_, p1) => {
    return `<a href="http${p1}">http${p1}</a>`;
  });

  // Newline
  rollingResult = rollingResult.replace(/\n/g, () => {
    return `<br/>`;
  });

  // Math
  rollingResult = rollingResult.replace(/\$(.+?)\$/g, (_, p1) => {
    const math = katex.renderToString(p1, {
      throwOnError: false,
      displayMode: false,
    });
    return `<span class="inline-math">` + math + `</span>`;
  });

  // Bold
  rollingResult = rollingResult.replace(/\*\*([^_*]+?)\*\*/g, (_, p1) => {
    return `<b>${p1}</b>`;
  });
  rollingResult = rollingResult.replace(/__([^_*]+?)__/g, (_, p1) => {
    return `<b>${p1}</b>`;
  });

  // (?<!\\)\*([^_*]+?)(?!\\)\*
  // Italic
  rollingResult = rollingResult.replace(
    /(?<!\\)\*([^_*]+?)(?!\\)\*/g,
    (_, p1) => {
      return `<em>${p1}</em>`;
    },
  );
  rollingResult = rollingResult.replace(
    /(?<!\\)_([^_*]+?)(?!\\)_/g,
    (_, p1) => {
      return `<em>${p1}</em>`;
    },
  );

  // Code
  rollingResult = rollingResult.replace(/`(.+?)`/g, (_, p1) => {
    return `<code class="inline-code">${p1}</code>`;
  });

  // Strikethrough
  rollingResult = rollingResult.replace(/~~(.+?)~~/g, (_, p1) => {
    return `<strike>${p1}</strike>`;
  });

  // Subscript
  rollingResult = rollingResult.replace(/~(.+?)~/g, (_, p1) => {
    return `<sub>${p1}</sub>`;
  });

  // Superscript
  rollingResult = rollingResult.replace(/\^(.+?)\^/g, (_, p1) => {
    return `<sup>${p1}</sup>`;
  });

  // Highlight
  rollingResult = rollingResult.replace(/==(.+?)==/g, (_, p1) => {
    return `<mark>${p1}</mark>`;
  });

  // Image
  rollingResult = rollingResult.replace(/!\[(.*?)\]\((.*?)\)/g, (_, p1, p2) => {
    return `<img src="${p2}" alt="${p1}"/>`;
  });

  // Anchor
  rollingResult = rollingResult.replace(/\[(.*?)\]\((.*?)\)/g, (_, p1, p2) => {
    const b: string[] = p2.split(" ");
    return `<a href="${b[0]}"${b.length > 1 ? ` title="${b.slice(1).join(" ")}"` : ""} target="_blank" rel="noreferrer">${p1}</a>`;
  });

  // \-Cleanup
  rollingResult = rollingResult.replace(/\\([_*])/g, (_, p1) => {
    return `${p1}`;
  });

  return rollingResult;
}
