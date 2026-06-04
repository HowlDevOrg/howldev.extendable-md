export const asRegex = /(.*)\s+as\s+(.*)/;
export const operatorRegex =
  /(.*)(&&|\|\||!=|={2}|<=?|>=?|\*|-|\+|\/|%)(?![^()]*\))(.*)/;
export const functionRegex = /(\w*)\s*\(([^()]*)\)/;
export const assignRegex = /(.*)[^<>!=]=[^=](.*)/;
