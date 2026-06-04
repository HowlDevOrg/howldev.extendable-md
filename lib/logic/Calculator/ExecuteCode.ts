import { CodeError, InternalError, UserError } from "./customErrors";
import { evaluateExpression } from "./Helpers/evaluateExpression";
import { assignRegex } from "./Helpers/regex";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
import { StructuredReturnToString } from "./Helpers/structuredReturnToString";
import {
  ExecutionReturn,
  ObjectWithStructuredValue,
  ParamDef,
  StructuredReturn,
} from "./types";

export function ExecuteCode(
  paramDef: ParamDef[],
  values: string[],
  code: string[],
): ExecutionReturn[] {
  if (paramDef.length !== values.length)
    throw new InternalError("Arrays are not of equal size.");
  const lookup: ObjectWithStructuredValue = {};
  for (let i = 0; i < paramDef.length; i++) {
    lookup[paramDef[i].name] = paramDefAndValueToStructuredOutput(
      paramDef[i],
      values[i],
    );
  }
  for (let i = 0; i < code.length; i++) {
    const splitString = code[i].split(" ").filter((a) => !!a);
    const expValue = splitString.slice(1).join(" ");
    switch (splitString[0].toLowerCase()) {
      case "return": {
        console.log(expValue);
        const vals = evaluateExpression(expValue, lookup);
        console.log(vals);
        return [{ label: vals.label, value: StructuredReturnToString(vals) }];
      }
      case "throw":
        throw new UserError(expValue);
      case "throwifoutsiderange": {
        const args = expValue.split(",");
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
        break;
      }
      case "assign": {
        const match = expValue.match(assignRegex);
        if (match && match[1] && match[2]) {
          lookup[match[1].trim()] = evaluateExpression(match[2].trim(), lookup);
        } else {
          throw new CodeError(
            "Did not match assignment regex in assign block.",
          );
        }
        break;
      }
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  throw new CodeError("Did not find a return statement.");
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
