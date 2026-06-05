import {
  assignIntoLookup,
  getReturnArray,
  throwIfOutsideRange,
} from "./keywordFuncs";
import { CodeError, InternalError, UserError } from "./customErrors";
import { evaluateExpression } from "./Helpers/evaluateExpression";
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
  // let returnValue: ExecutionReturn[] | null = null;
  for (let i = 0; i < code.length; i++) {
    const splitString = code[i].split(" ").filter((a) => !!a);
    const exprValue = splitString.slice(1).join(" ");
    switch (splitString[0].toLowerCase()) {
      case "return":
        return getReturnArray(exprValue, lookup);
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
  throw new CodeError("Did not find a return statement.");
}
