import { StructuredReturnToString } from "./structuredReturnToString";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateExpression } from "./evaluateExpression";
import { isQuotedString, getInnerString } from "./stringHelpers";
import { CodeError } from "../customErrors";

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
    const result = evaluateExpression(match[1], lookup);
    key =
      result.type === "string"
        ? '"' + result.value + '"'
        : StructuredReturnToString(result);
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
    throw new CodeError(`Cannot find key ${key}.`);
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
