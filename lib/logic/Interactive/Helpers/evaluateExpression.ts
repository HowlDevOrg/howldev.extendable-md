import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateBinaryOperators } from "./evaluateBinaryOperators";
import { extractLabelAndValue } from "./extractLabelAndValue";
import { StructuredReturnToString } from "./structuredReturnToString";

export function evaluateExpression(
  possibleExp: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  const asRegex = /(.*)\s+as\s+(.*)/;
  const asMatch = possibleExp.match(asRegex);
  let label;

  if (asMatch) {
    const result = evaluateExpression(asMatch[1], lookup);
    possibleExp =
      result.type === "string"
        ? '"' + result.value + '"'
        : StructuredReturnToString(result);
    label = asMatch[2];
  } else {
    label = "";
  }

  const operatorRegex = /(.*)(&&|\|\||!=|={2}|<=?|>=?|\*|-|\+|\/|%)(.*)/;
  const opMatch = possibleExp.match(operatorRegex);
  if (opMatch) {
    return evaluateBinaryOperators(opMatch, label, lookup);
  } else {
    return extractLabelAndValue(possibleExp.trim(), lookup, label);
  }
}
