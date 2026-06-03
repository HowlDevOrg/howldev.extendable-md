import { CodeError, InternalError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateExpression } from "./evaluateExpression";

export function evaluateFunctions(
  funcMatch: RegExpMatchArray,
  label: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  switch (funcMatch[1]) {
    // Math methods ////////////////////////////////////////////
    case "e":
      if (funcMatch[2])
        throw new CodeError(
          "Don't include any parameters with the function e.",
        );
      return { label: label, type: "number", value: Math.E };
    case "pi":
      if (funcMatch[2])
        throw new CodeError(
          "Don't include any parameters with the function pi.",
        );
      return { label: label, type: "number", value: Math.PI };
    case "sqrt":
      let sqrt = getNumber(funcMatch[2], lookup, "sqrt");
      return { label: label, type: "number", value: Math.sqrt(sqrt) };
    case "sin":
      let sin = getNumber(funcMatch[2], lookup, "sin");
      return { label: label, type: "number", value: Math.sin(sin) };
    case "cos":
      let cos = getNumber(funcMatch[2], lookup, "cos");
      return { label: label, type: "number", value: Math.cos(cos) };
    case "tan":
      let tan = getNumber(funcMatch[2], lookup, "tan");
      return { label: label, type: "number", value: Math.tan(tan) };
    case "round":
      let round = getNumber(funcMatch[2], lookup, "round");
      return { label: label, type: "number", value: Math.round(round) };
    case "floor":
      let floor = getNumber(funcMatch[2], lookup, "floor");
      return { label: label, type: "number", value: Math.floor(floor) };
    case "ceil":
      let ceil = getNumber(funcMatch[2], lookup, "ceil");
      return { label: label, type: "number", value: Math.ceil(ceil) };
    case "degtorad":
      let degtorad = getNumber(funcMatch[2], lookup, "degtorad");
      return {
        label: label,
        type: "number",
        value: degtorad / (180 / Math.PI),
      };
    case "radtodeg":
      let radtodeg = getNumber(funcMatch[2], lookup, "radtodeg");
      return {
        label: label,
        type: "number",
        value: radtodeg * (180 / Math.PI),
      };
    case "log":
      let log = getNumber(funcMatch[2], lookup, "log");
      return { label: label, type: "number", value: Math.log10(log) };
    case "log2":
      let log2 = getNumber(funcMatch[2], lookup, "log2");
      return { label: label, type: "number", value: Math.log2(log2) };
    case "ln":
      let ln = getNumber(funcMatch[2], lookup, "ln");
      return { label: label, type: "number", value: Math.log(ln) };
    case "abs":
      let abs = getNumber(funcMatch[2], lookup, "abs");
      return { label: label, type: "number", value: Math.abs(abs) };
    // String methods ////////////////////////////////////////////
    case "isEmpty":
      let isEmpty = getString(funcMatch[2], lookup, "isEmpty");
      return { label: label, type: "bool", value: !isEmpty };
    case "isNotEmpty":
      let isNotEmpty = getString(funcMatch[2], lookup, "isNotEmpty");
      return { label: label, type: "bool", value: !!isNotEmpty };
    case "len":
      let len = getString(funcMatch[2], lookup, "len");
      return { label: label, type: "number", value: len.length };
    default:
      throw new CodeError(`Couldn't find function name ${funcMatch[1]}.`);
  }
}

function getNumber(
  charString: string,
  lookup: ObjectWithStructuredValue,
  funcName: string,
): number {
  let sqrt = evaluateExpression(charString, lookup);
  if (sqrt.type !== "number")
    throw new CodeError(
      `Can't get number from value ${sqrt.value} in function ${funcName}.`,
    );
  return sqrt.value as number;
}

function getString(
  charString: string,
  lookup: ObjectWithStructuredValue,
  funcName: string,
): string {
  let sqrt = evaluateExpression(charString, lookup);
  if (sqrt.type !== "string")
    throw new CodeError(
      `Can't get string from value ${sqrt.value} in function ${funcName}.`,
    );
  return sqrt.value as string;
}
