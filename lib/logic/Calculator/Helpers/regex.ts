export const asRegex = /(.*)\s+as\s+(.*)/;
export const prioritizedOperatorRegex =
  /(-?[\d\w".]*)\s*(!=|={2}|<=?|>=?|\*|\/|%)\s*(-?[\d\w".]*)/;
export const lazyOperatorRegex =
  /(-?[\d\w"\s.]*)\s*(&&|\|\||\+|-)\s*(-?[\d\w"\s.]*)/;
export const functionRegex = /(\w*)\s*\(([^()]*)\)/;
export const assignRegex = /(.*)[^<>!=]=[^=](.*)/;
