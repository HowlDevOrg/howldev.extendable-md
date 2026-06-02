import { CodeError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { extractLabelAndValue } from "./extractLabelAndValue";

export function evaluateExpression(
  possibleExp: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  const operatorRegex = /(.*)(!=|={2}|<=?|>=?|\*|-|\+|\/|%)(.*)/;
  const match = possibleExp.match(operatorRegex);
  if (match) {
    const num1 = evaluateExpression(match[1], lookup);
    const num2 = evaluateExpression(match[3], lookup);
    if (num1.type !== num2.type) {
      throw new CodeError(`Can't execute operator ${match[2]} on types ${num1.type} and ${num2.type}.`)
    }
    switch (match[2]) {
      case "+":
        return {
          value: (Number(num1.value) + Number(num2.value)).toString(),
          type: "number",
          label: "",
        };
      case "-":
        return {
          value: ((num1.value as number) - (num2.value as number)).toString(),
          type: "number",
          label: "",
        };
      case "*":
        return {
          value: (Number(num1.value) * Number(num2.value)).toString(),
          type: "number",
          label: "",
        };
      case "/":
        return {
          value: ((num1.value as number) / (num2.value as number)).toString(),
          type: "number",
          label: "",
        };
      case "%":
        return {
          value: ((num1.value as number) % (num2.value as number)).toString(),
          type: "number",
          label: "",
        };
      case "<":
        return {
          value: ((num1.value as number) < (num2.value as number)),
          type: "bool",
          label: "",
        };
      case ">":
        return {
          value: ((num1.value as number) > (num2.value as number)),
          type: "bool",
          label: "",
        };
      case "<=":
        return {
          value: ((num1.value as number) <= (num2.value as number)),
          type: "bool",
          label: "",
        };
      case ">=":
        return {
          value: ((num1.value as number) >= (num2.value as number)),
          type: "bool",
          label: "",
        };
      case "!=":
        return {
          value: ((num1.value as number) != (num2.value as number)),
          type: "bool",
          label: "",
        };
      case "==":
        return {
          value: ((num1.value as number) == (num2.value as number)),
          type: "bool",
          label: "",
        };
      default:
        throw new CodeError(
          `Unknown operator error: Could not find operator ${match[2]}`,
        );
    }
  } else {
    return extractLabelAndValue(possibleExp, lookup);
  }
}


