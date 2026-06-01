import { ExecutionReturn } from "../ExecuteCode";

export function extractLabelAndValue(
  key: string,
  // eslint-disable-next-line
  lookup: any,
): ExecutionReturn {
  let returnLabel, returnValue;

  const asRegex = /(.*)\s+as\s+(.*)/;
  const match = key.match(asRegex);
  if (match) {
    key = match[1];
  }

  if (key.startsWith('"') && key.endsWith('"')) {
    returnValue = key.slice(1, key.length - 1);
    returnLabel = "";
  } else if (Number(key)) {
    returnValue = Number(key).toString();
    returnLabel = "";
  } else if (key === "true" || key === "false") {
    returnValue = key;
    returnLabel = "";
  } else if (!(key in lookup)) {
    throw new Error(`Cannot find key ${key}.`);
  } else {
    returnValue = lookup[key];
    returnLabel = key;
  }

  if (match) {
    returnLabel = match[2];
  }
  return { label: returnLabel, value: returnValue };
}
