import {
  assignIntoLookup,
  getReturnArray,
  throwIfOutsideRange,
} from "./keywordFuncs";
import { CodeError, InternalError, UserError } from "./customErrors";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
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
  const { returnValue } = executeInstructions(code, lookup);
  if (!returnValue) {
    throw new CodeError("Did not find a return statement.");
  }
  return returnValue;
}

function executeInstructions(
  code: string[],
  lookup: ObjectWithStructuredValue,
): { returnValue: ExecutionReturn[] | null; i: number } {
  for (let i = 0; i < code.length; i++) {
    const splitString = code[i].split(" ").filter((a) => !!a);
    const exprValue = splitString.slice(1).join(" ");
    switch (splitString[0].toLowerCase()) {
      case "return":
        return { returnValue: getReturnArray(exprValue, lookup), i: -1 };
      case "throw":
        throw new UserError(exprValue);
      case "throwifoutsiderange":
        throwIfOutsideRange(exprValue, lookup);
        break;
      case "assign":
        assignIntoLookup(exprValue, lookup);
        break;
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  return { returnValue: null, i: -1 };
}
