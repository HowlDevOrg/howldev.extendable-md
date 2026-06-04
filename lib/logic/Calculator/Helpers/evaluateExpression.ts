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
  console.log('"' + possibleExp.trim() + '"', opMatch, funcMatch)
  console.log(isWrappedInParens(possibleExp));
  if (isWrappedInParens(possibleExp)) {
    return evaluateExpression(
      possibleExp.trim().slice(1, possibleExp.length - 2),
      lookup,
    );
  } else if (opMatch) {
    return evaluateBinaryOperators(opMatch, label, lookup);
  } else if (funcMatch) {
    return evaluateFunctions(funcMatch, label, lookup);
  } else {
    return extractLabelAndValue(possibleExp.trim(), lookup, label);
  }
}

// AI generated function
function isWrappedInParens(input: string): boolean {
    const s = input.trim();
    if (s[0] !== '(' || s[s.length - 1] !== ')') return false;

    let depth = 0;
    for (let i = 0; i < s.length - 1; i++) {  // stop before last char
        if (s[i] === '(') depth++;
        else if (s[i] === ')') depth--;

        if (depth === 0) return false;  // closed before the end
    }
    return true;
}
