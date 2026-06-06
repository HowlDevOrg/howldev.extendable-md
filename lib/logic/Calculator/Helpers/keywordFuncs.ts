import { CodeError, InternalError, UserError } from "./customErrors";
import { evaluateExpression } from "./evaluateExpression";
import { executeInstructions } from "./executeInstructions";
import { assignRegex } from "./regex";
import { splitOnOutermostCommas } from "./stringHelpers";
import { StructuredReturnToString } from "./structuredReturnToString";
import { ExecutionReturn, ObjectWithStructuredValue, StructuredReturn } from "../types";

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
}export function runIfStatement(
  statements: string[][],
  lookup: ObjectWithStructuredValue): ExecutionReturn[] | null {
  for (const codeArray of statements) {
    const fsa = codeArray[0].split(" ").filter((a) => !!a);
    if (fsa[0].toLowerCase() !== "else") {
      const newExprValue = fsa.slice(1).join(" ");
      const evaluation = evaluateExpression(newExprValue, lookup);
      if (evaluation.type === "bool") {
        if (evaluation.value as boolean) {
          const newCode = codeArray.slice(1);
          const returnValue = executeInstructions(newCode, lookup);
          if (returnValue) return returnValue;
          break;
        }
      } else {
        throw new CodeError(
          `Cannot interpret type ${evaluation.type} as a boolean in an if statement.`
        );
      }
    } else {
      const newCode = codeArray.slice(1);
      const returnValue = executeInstructions(newCode, lookup);
      if (returnValue) return returnValue;
    }
  }
  return null;
}
export function runSwitchStatement(
  statements: string[][],
  lookup: ObjectWithStructuredValue,
  switchValue: StructuredReturn): ExecutionReturn[] | null {
  for (const codeArray of statements) {
    const fsa = codeArray[0].split(" ").filter((a) => !!a);
    if (fsa[0].toLowerCase() !== "case")
      throw new InternalError(
        `Switch statement found ${fsa[0]} instead of case statements.`
      );

    const newExprValue = fsa.slice(1).join(" ");
    const evaluation = evaluateExpression(newExprValue, lookup);
    if (evaluation.type !== switchValue.type) {
      throw new CodeError(
        `Types do not match in switch expression: ${switchValue.type} (switch) and ${evaluation.type} (case).`
      );
    }
    if (evaluation.value === switchValue.value) {
      const newCode = codeArray.slice(1);
      const returnValue = executeInstructions(newCode, lookup);
      if (returnValue) return returnValue;
      break;
    }
  }

  return null;
}

