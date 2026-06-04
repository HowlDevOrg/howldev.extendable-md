import { CodeError, UserError } from "./customErrors";
import { evaluateExpression } from "./Helpers/evaluateExpression";
import { assignRegex } from "./Helpers/regex";
import { splitOnOutermostCommas } from "./Helpers/stringHelpers";
import { StructuredReturnToString } from "./Helpers/structuredReturnToString";
import { ObjectWithStructuredValue, StructuredReturn } from "./types";

export function assignIntoLookup(
  exprValue: string,
  lookup: ObjectWithStructuredValue,
) {
  const match = exprValue.match(assignRegex);
  if (match && match[1] && match[2]) {
    lookup[match[1].trim()] = evaluateExpression(match[2].trim(), lookup);
  } else {
    throw new CodeError("Did not match assignment regex in assign block.");
  }
}

export function throwIfOutsideRange(
  exprValue: string,
  lookup: ObjectWithStructuredValue,
) {
  const args = exprValue.split(",");
  const value = evaluateExpression(args[0], lookup);
  const lowerBound = evaluateExpression(args[1], lookup);
  const upperBound = evaluateExpression(args[2], lookup);
  const v = throwIfNotNumber(value);
  const lb = throwIfNotNumber(lowerBound);
  const ub = throwIfNotNumber(upperBound);
  if (v < lb || v > ub) {
    const displayName = value.label
      ? `${value.value} (${value.label})`
      : value.value;
    throw new UserError(
      `${displayName} is outside of range ${lowerBound.value} - ${upperBound.value}.`,
    );
  }
}

export function getReturnArray(
  exprValue: string,
  lookup: ObjectWithStructuredValue,
) {
  const expressions = splitOnOutermostCommas(exprValue);
  return expressions.map((a) => {
    const vals = evaluateExpression(a, lookup);
    return { label: vals.label, value: StructuredReturnToString(vals) };
  });
}

function throwIfNotNumber(value: StructuredReturn): number {
  if (value.type !== "number") {
    const displayValue =
      value.type === "string" ? '"' + value.value + '"' : value.value;
    throw new CodeError(
      `Value ${displayValue} must be of type number in throwIfOutsideRange.`,
    );
  }
  return value.value as number;
}
