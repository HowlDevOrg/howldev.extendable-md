import { CodeError } from "./customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateBinaryOperators } from "./evaluateBinaryOperators";
import { evaluateFunctions } from "./evaluateFunctions";
import { extractLabelAndValue } from "./extractLabelAndValue";
import {
  asRegex,
  functionRegex,
  prioritizedOperatorRegex,
  lazyOperatorRegex,
} from "./regex";
import {
  StructuredReturnReplacementString,
  StructuredReturnToString,
} from "./structuredReturnToString";

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
    possibleExp = possibleExp.replace(
      funcMatch[0],
      StructuredReturnReplacementString(
        evaluateFunctions(funcMatch, label, lookup),
      ),
    );
    funcMatch = possibleExp.match(functionRegex);
    iterations++;
  }

  if (iterations === 10) {
    throw new CodeError(
      `Cannot evaluate string ${originalExp}. Too many parenthesis.`,
    );
  }

  if (!isNaN(Number(possibleExp)))
    return extractLabelAndValue(possibleExp.trim(), lookup, label);

  let opMatch = possibleExp.match(prioritizedOperatorRegex);
  iterations = 0;
  while (opMatch && iterations < 10) {
    possibleExp = possibleExp.replace(
      opMatch[0],
      StructuredReturnReplacementString(
        evaluateBinaryOperators(opMatch, label, lookup),
      ),
    );
    opMatch = possibleExp.match(prioritizedOperatorRegex);
    iterations++;
  }

  if (!isNaN(Number(possibleExp)))
    return extractLabelAndValue(possibleExp.trim(), lookup, label);

  opMatch = possibleExp.match(lazyOperatorRegex);
  while (opMatch && iterations < 10) {
    // Operator is a negative sign
    if (!opMatch[1]) break;
    possibleExp = possibleExp.replace(
      opMatch[0],
      StructuredReturnReplacementString(
        evaluateBinaryOperators(opMatch, label, lookup),
      ),
    );
    opMatch = possibleExp.match(lazyOperatorRegex);
    iterations++;
  }

  if (iterations === 10) {
    throw new CodeError(
      `Cannot evaluate string ${originalExp}. Too many operators.`,
    );
  }

  return extractLabelAndValue(possibleExp.trim(), lookup, label);
}
