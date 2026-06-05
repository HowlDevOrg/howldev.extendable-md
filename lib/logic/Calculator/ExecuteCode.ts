import { CodeError, InternalError } from "./customErrors";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
import { ExecutionReturn, ObjectWithStructuredValue, ParamDef } from "./types";
import { executeInstructions } from "./executeInstructions";

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
  const returnValue = executeInstructions(code, lookup);
  if (!returnValue) {
    throw new CodeError("Did not find a return statement.");
  }
  return returnValue;
}
