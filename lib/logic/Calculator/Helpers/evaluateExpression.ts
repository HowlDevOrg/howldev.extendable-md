import { CodeError } from "../customErrors";
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
  const originalExp = possibleExp;
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

  let funcMatch = possibleExp.match(functionRegex);
  let iterations = 0; // important safety hatch!
  while (funcMatch && iterations < 10) {
    possibleExp = possibleExp.replace(funcMatch[0], StructuredReturnToString(evaluateFunctions(funcMatch, label, lookup)));
    funcMatch = possibleExp.match(functionRegex);
    iterations++;
  }

  if (iterations === 10) {
    throw new CodeError(`Cannot evaluate string ${originalExp}. Too many parenthesis.`);
  }

  const opMatch = possibleExp.match(operatorRegex);
  if (opMatch) {
    return evaluateBinaryOperators(opMatch, label, lookup);
  } else {
    return extractLabelAndValue(possibleExp.trim(), lookup, label);
  }
}
