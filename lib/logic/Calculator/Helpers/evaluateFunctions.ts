import { CodeError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateExpression } from "./evaluateExpression";
import { StructuredReturnToString } from "./structuredReturnToString";

export function evaluateFunctions(
  funcMatch: RegExpMatchArray,
  label: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  switch (funcMatch[1]) {
    case "": {
      return evaluateExpression(funcMatch[2], lookup);
    }
    // Math methods ////////////////////////////////////////////
    case "e": {
      if (funcMatch[2])
        throw new CodeError(
          "Don't include any parameters with the function e.",
        );
      return { label: label, type: "number", value: Math.E };
    }
    case "pi": {
      if (funcMatch[2])
        throw new CodeError(
          "Don't include any parameters with the function pi.",
        );
      return { label: label, type: "number", value: Math.PI };
    }
    case "sqrt": {
      const sqrt = getNumber(funcMatch[2], lookup, "sqrt");
      return { label: label, type: "number", value: Math.sqrt(sqrt) };
    }
    case "sin": {
      const sin = getNumber(funcMatch[2], lookup, "sin");
      return { label: label, type: "number", value: Math.sin(sin) };
    }
    case "cos": {
      const cos = getNumber(funcMatch[2], lookup, "cos");
      return { label: label, type: "number", value: Math.cos(cos) };
    }
    case "tan": {
      const tan = getNumber(funcMatch[2], lookup, "tan");
      return { label: label, type: "number", value: Math.tan(tan) };
    }
    case "round": {
      const round = getNumber(funcMatch[2], lookup, "round");
      return { label: label, type: "number", value: Math.round(round) };
    }
    case "floor": {
      const floor = getNumber(funcMatch[2], lookup, "floor");
      return { label: label, type: "number", value: Math.floor(floor) };
    }
    case "ceil": {
      const ceil = getNumber(funcMatch[2], lookup, "ceil");
      return { label: label, type: "number", value: Math.ceil(ceil) };
    }
    case "degtorad": {
      const degtorad = getNumber(funcMatch[2], lookup, "degtorad");
      return {
        label: label,
        type: "number",
        value: degtorad / (180 / Math.PI),
      };
    }
    case "radtodeg": {
      const radtodeg = getNumber(funcMatch[2], lookup, "radtodeg");
      return {
        label: label,
        type: "number",
        value: radtodeg * (180 / Math.PI),
      };
    }
    case "log": {
      const log = getNumber(funcMatch[2], lookup, "log");
      return { label: label, type: "number", value: Math.log10(log) };
    }
    case "log2": {
      const log2 = getNumber(funcMatch[2], lookup, "log2");
      return { label: label, type: "number", value: Math.log2(log2) };
    }
    case "ln": {
      const ln = getNumber(funcMatch[2], lookup, "ln");
      return { label: label, type: "number", value: Math.log(ln) };
    }
    case "abs": {
      const abs = getNumber(funcMatch[2], lookup, "abs");
      return { label: label, type: "number", value: Math.abs(abs) };
    }
    case "pow": {
      const powSplit = funcMatch[2].split(",").map((a) => a.trim());
      if (powSplit.length != 2)
        throw new CodeError("Pow needs 2 number operands.");
      const pow1 = getNumber(powSplit[0], lookup, "pow");
      const pow2 = getNumber(powSplit[1], lookup, "pow");
      return { label: label, type: "number", value: Math.pow(pow1, pow2) };
    }
    case "atan2": {
      const atan2Split = funcMatch[2].split(",").map((a) => a.trim());
      if (atan2Split.length != 2)
        throw new CodeError("Atan2 needs 2 number operands.");
      const atan21 = getNumber(atan2Split[0], lookup, "atan2");
      const atan22 = getNumber(atan2Split[1], lookup, "atan2");
      return {
        label: label,
        type: "number",
        value: Math.atan2(atan21, atan22),
      };
    }
    // String methods ////////////////////////////////////////////
    case "isEmpty": {
      const isEmpty = getString(funcMatch[2], lookup, "isEmpty");
      return { label: label, type: "bool", value: !isEmpty };
    }
    case "isNotEmpty": {
      const isNotEmpty = getString(funcMatch[2], lookup, "isNotEmpty");
      return { label: label, type: "bool", value: !!isNotEmpty };
    }
    case "len": {
      const len = getString(funcMatch[2], lookup, "len");
      return { label: label, type: "number", value: len.length };
    }
    case "str": {
      const val = evaluateExpression(funcMatch[2], lookup);
      return { label: label, type: "string", value: StructuredReturnToString(val) };
    }
    default:
      throw new CodeError(`Couldn't find function name ${funcMatch[1]}.`);
  }
}

function getNumber(
  charString: string,
  lookup: ObjectWithStructuredValue,
  funcName: string,
): number {
  const number = evaluateExpression(charString, lookup);
  if (number.type !== "number")
    throw new CodeError(
      `Can't get number from value ${number.value} in function ${funcName}.`,
    );
  return number.value as number;
}

function getString(
  charString: string,
  lookup: ObjectWithStructuredValue,
  funcName: string,
): string {
  const string = evaluateExpression(charString, lookup);
  if (string.type !== "string")
    throw new CodeError(
      `Can't get string from value ${string.value} in function ${funcName}.`,
    );
  return string.value as string;
}
