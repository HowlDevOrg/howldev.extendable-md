import { assignIntoLookup, getReturnArray, throwIfOutsideRange } from "./keywordFuncs";
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
      case "if": {
        const match = evaluateExpression(exprValue, lookup);
        if (match.type !== "bool")
          throw new CodeError(
            `Cannot interpret type ${match.type} in an if statement.`,
          );
        if (match.value as boolean) {
          do {
            i++;
            let newSplitString = code[i].split(" ").filter((a) => !!a);
            let newExprValue = splitString.slice(1).join(" ");
          } while (i < code.length);
        }
        break;
      }
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  throw new CodeError("Did not find a return statement.");
}
