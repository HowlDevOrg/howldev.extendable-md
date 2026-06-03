import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateBinaryOperators } from "./evaluateBinaryOperators";
import { evaluateFunctions } from "./evaluateFunctions";
import { extractLabelAndValue } from "./extractLabelAndValue";
import { asRegex, functionRegex, operatorRegex } from "./regex";
import { StructuredReturnToString } from "./structuredReturnToString";

export function evaluateExpression(
  possibleExp: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
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

  const opMatch = possibleExp.match(operatorRegex);
  const funcMatch = possibleExp.match(functionRegex);
  if (opMatch && funcMatch) {
    return opMatch[0].length >= funcMatch[0].length
      ? evaluateBinaryOperators(opMatch, label, lookup)
      : evaluateFunctions(funcMatch, label, lookup);
  }
  if (opMatch) {
    return evaluateBinaryOperators(opMatch, label, lookup);
  } else if (funcMatch) {
    return evaluateFunctions(funcMatch, label, lookup);
  } else {
    return extractLabelAndValue(possibleExp.trim(), lookup, label);
  }
}
