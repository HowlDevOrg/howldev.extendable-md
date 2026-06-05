import {
  assignIntoLookup,
  getReturnArray,
  throwIfOutsideRange,
} from "./keywordFuncs";
import { CodeError, InternalError, UserError } from "./customErrors";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
import { ExecutionReturn, ObjectWithStructuredValue, ParamDef } from "./types";
import { evaluateExpression } from "./Helpers/evaluateExpression";

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

function executeInstructions(
  code: string[],
  lookup: ObjectWithStructuredValue,
): ExecutionReturn[] | null {
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
      case "if":
        const result = evaluateExpression(exprValue, lookup);
        if (result.type !== "bool")
          throw new CodeError(
            `Cannot interpret type ${result.type} as a boolean in an if statement.`,
          );

        const indexOfEndif = code.findIndex((a) => a.startsWith("endif"));
        if (indexOfEndif === -1)
          throw new CodeError("Did not find endif statement.");
        if (result.value as boolean) {
          const newCode: string[] = [];
          let breakOut = false;
          do {
            i++;
            let newSplitString = code[i].split(" ").filter((a) => !!a);
            if (newSplitString[0] !== "else") {
              newCode.push(code[i]);
              breakOut = true;
            }
          } while (i < code.length && !breakOut);
          const returnValue = executeInstructions(newCode, lookup);
          if (returnValue) return returnValue;
        } else {
          const newCode: string[] = [];
          let breakOut = false;
          let found = false;
          do {
            i++;
            let newSplitString = code[i].split(" ").filter((a) => !!a);
            if (!found && newSplitString[0] === "else") {
              found = true;
            } else if (found && newSplitString[0] !== "endif") {
              newCode.push(code[i]);
            } else if (newSplitString[0] === "endif") {
              breakOut = true;
            }
          } while (i < code.length && !breakOut);
          const returnValue = executeInstructions(newCode, lookup);
          if (returnValue) return returnValue;
        }
        i = indexOfEndif;
        break;
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  return null;
}
