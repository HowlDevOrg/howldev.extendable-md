import { CodeError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateExpression } from "./evaluateExpression";

const VALID_OPERATORS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "<",
  ">",
  "<=",
  ">=",
  "!=",
  "==",
  "||",
  "&&",
];

export function evaluateBinaryOperators(
  opMatch: RegExpMatchArray,
  label: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  const num1 = evaluateExpression(opMatch[1], lookup);
  const num2 = evaluateExpression(opMatch[3], lookup);
  if (num1.type !== num2.type) {
    throw new CodeError(
      `Can't execute operator ${opMatch[2]} on types ${num1.type} and ${num2.type}.`,
    );
  }

  if (!VALID_OPERATORS.includes(opMatch[2])) {
    throw new CodeError(
      `Unknown operator error: Could not find operator ${opMatch[2]}`,
    );
  }

  if (num1.type === "string") {
    const str1 = num1.value as string;
    const str2 = num2.value as string;
    switch (opMatch[2]) {
      case "+":
        return { value: str1 + str2, type: "string", label: label };
      case "!=":
        return { value: str1 != str2, type: "bool", label: label };
      case "==":
        return { value: str1 == str2, type: "bool", label: label };
      default:
        throw new CodeError(
          `Type string is not valid for operator ${opMatch[2]}.`,
        );
    }
  } else if (num1.type === "number") {
    const n1 = Number(num1.value);
    const n2 = Number(num2.value);
    switch (opMatch[2]) {
      case "+":
        return { value: (n1 + n2).toString(), type: "number", label: label };
      case "-":
        return { value: (n1 - n2).toString(), type: "number", label: label };
      case "*":
        return { value: (n1 * n2).toString(), type: "number", label: label };
      case "/":
        return { value: (n1 / n2).toString(), type: "number", label: label };
      case "%":
        return { value: (n1 % n2).toString(), type: "number", label: label };
      case "<":
        return { value: n1 < n2, type: "bool", label: label };
      case ">":
        return { value: n1 > n2, type: "bool", label: label };
      case "<=":
        return { value: n1 <= n2, type: "bool", label: label };
      case ">=":
        return { value: n1 >= n2, type: "bool", label: label };
      case "!=":
        return { value: n1 != n2, type: "bool", label: label };
      case "==":
        return { value: n1 == n2, type: "bool", label: label };
      default:
        throw new CodeError(
          `Type number is not valid for operator ${opMatch[2]}.`,
        );
    }
  } else {
    const bool1 = num1.value as boolean;
    const bool2 = num2.value as boolean;
    switch (opMatch[2]) {
      case "!=":
        return { value: bool1 != bool2, type: "bool", label: label };
      case "==":
        return { value: bool1 == bool2, type: "bool", label: label };
      case "&&":
        return { value: bool1 && bool2, type: "bool", label: label };
      case "||":
        return { value: bool1 || bool2, type: "bool", label: label };
      default:
        throw new CodeError(
          `Type bool is not valid for operator ${opMatch[2]}.`,
        );
    }
  }
}
