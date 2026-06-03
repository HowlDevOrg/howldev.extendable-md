import { CodeError, InternalError } from "../customErrors";
import { ObjectWithStructuredValue, StructuredReturn } from "../types";
import { evaluateExpression } from "./evaluateExpression";

export function evaluateFunctions(
  funcMatch: RegExpMatchArray,
  label: string,
  lookup: ObjectWithStructuredValue,
): StructuredReturn {
  switch (funcMatch[1]) {
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
