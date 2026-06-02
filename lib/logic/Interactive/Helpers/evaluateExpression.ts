import { CodeError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
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

  const operatorRegex = /(.*)(!=|={2}|<=?|>=?|\*|-|\+|\/|%)(.*)/;
  const opMatch = possibleExp.match(operatorRegex);
  if (opMatch) {
    const num1 = evaluateExpression(opMatch[1], lookup);
    const num2 = evaluateExpression(opMatch[3], lookup);
    if (num1.type !== num2.type) {
      throw new CodeError(
        `Can't execute operator ${opMatch[2]} on types ${num1.type} and ${num2.type}.`,
      );
    }
    switch (opMatch[2]) {
      case "+":
        if (num1.type === "number") {
          return {
            value: (Number(num1.value) + Number(num2.value)).toString(),
            type: "number",
            label: label,
          };
        } else if (num1.type === "string") {
          return {
            value: ((num1.value as string) + (num2.value as string)).toString(),
            type: "string",
            label: label,
          };
        } else {
          throw new CodeError("Cannot apply + operator to bool types.");
        }
      case "-":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: ((num1.value as number) - (num2.value as number)).toString(),
          type: "number",
          label: label,
        };
      case "*":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: (Number(num1.value) * Number(num2.value)).toString(),
          type: "number",
          label: label,
        };
      case "/":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: ((num1.value as number) / (num2.value as number)).toString(),
          type: "number",
          label: label,
        };
      case "%":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: ((num1.value as number) % (num2.value as number)).toString(),
          type: "number",
          label: label,
        };
      case "<":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: (num1.value as number) < (num2.value as number),
          type: "bool",
          label: label,
        };
      case ">":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: (num1.value as number) > (num2.value as number),
          type: "bool",
          label: label,
        };
      case "<=":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: (num1.value as number) <= (num2.value as number),
          type: "bool",
          label: label,
        };
      case ">=":
        possibleThrowForNonNumberForOperator(opMatch[2], num1);
        return {
          value: (num1.value as number) >= (num2.value as number),
          type: "bool",
          label: label,
        };
      case "!=":
        switch (num1.type) {
          case "string":
            return {
              value: (num1.value as string) != (num2.value as string),
              type: "bool",
              label: label,
            };
          case "number":
            return {
              value: (num1.value as number) != (num2.value as number),
              type: "bool",
              label: label,
            };
          case "bool":
            return {
              value: (num1.value as boolean) != (num2.value as boolean),
              type: "bool",
              label: label,
            };
        }
      case "==":
        switch (num1.type) {
          case "string":
            return {
              value: (num1.value as string) == (num2.value as string),
              type: "bool",
              label: label,
            };
          case "number":
            return {
              value: (num1.value as number) == (num2.value as number),
              type: "bool",
              label: label,
            };
          case "bool":
            return {
              value: (num1.value as boolean) == (num2.value as boolean),
              type: "bool",
              label: label,
            };
        }
      default:
        throw new CodeError(
          `Unknown operator error: Could not find operator ${opMatch[2]}`,
        );
    }
  } else {
    return extractLabelAndValue(possibleExp, lookup, label);
  }
}

function possibleThrowForNonNumberForOperator(
  op: string,
  type: StructuredReturn,
): void {
  if (type.type !== "number") {
    throw new CodeError(`Type ${type.type} is not valid for operator ${op}.`);
  }
}
