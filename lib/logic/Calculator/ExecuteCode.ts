import { CodeError, InternalError, UserError } from "./customErrors";
import { evaluateExpression } from "./Helpers/evaluateExpression";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
import { StructuredReturnToString } from "./Helpers/structuredReturnToString";
import { ExecutionReturn, ObjectWithStructuredValue, ParamDef } from "./types";

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
        const vals = evaluateExpression(expValue, lookup);
        return [{ label: vals.label, value: StructuredReturnToString(vals) }];
      }
      case "throw": throw new UserError(expValue);
      case "assign": {
        const assignRegex = /(.*)[^<>!=]=[^=](.*)/;
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
