import {
  ObjectWithStructuredValue,
  StructuredReturn,
} from "../types";
import { isQuotedString, getInnerString } from "./stringHelpers";

export function extractLabelAndValue(
  key: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  let returnLabel: string;
  let returnValue: string | number | boolean;
  let type: "string" | "number" | "bool";

  const asRegex = /(.*)\s+as\s+(.*)/;
  const match = key.match(asRegex);
  if (match) {
    key = match[1];
  }

  key = key.trim();

  if (isQuotedString(key)) {
    returnValue = getInnerString(key);
    returnLabel = "";
    type = "string";
  } else if (Number(key)) {
    returnValue = Number(key).toString();
    returnLabel = "";
    type = "number";
  } else if (key === "true" || key === "false") {
    returnValue = key === "true";
    returnLabel = "";
    type = "bool";
  } else if (!(key in lookup)) {
    throw new Error(`Cannot find key ${key}.`);
  } else {
    returnValue = lookup[key].value;
    returnLabel = key;
    type = lookup[key].type;
  }

  if (match) {
    returnLabel = match[2];
  }
  return { label: returnLabel, value: returnValue, type: type };
}
