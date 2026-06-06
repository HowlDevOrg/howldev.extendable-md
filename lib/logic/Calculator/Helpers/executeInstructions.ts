import { UserError, CodeError } from "./customErrors";
import { evaluateExpression } from "./evaluateExpression";
import { parseBlockStatements } from "./stringHelpers";
import {
  getReturnArray,
  throwIfOutsideRange,
  assignIntoLookup,
  runIfStatement,
  runSwitchStatement,
} from "./keywordFuncs";
import { ObjectWithStructuredValue, ExecutionReturn } from "../types";

export function executeInstructions(
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
      case "if": {
        const indexOfEndif = code.findIndex(
          (a, nI) => nI >= i && a.startsWith("endif"),
        );
        if (indexOfEndif === -1)
          throw new CodeError("Did not find endif statement.");

        const statements = parseBlockStatements(
          code.slice(i, indexOfEndif),
          "if",
          ["else", "elsif"],
        );

        const returnValue = runIfStatement(statements, lookup);
        if (returnValue) return returnValue;
        i = indexOfEndif;
        break;
      }
      case "switch": {
        const indexOfEndSwitch = code.findIndex(
          (a, nI) => nI >= i && a.startsWith("endswitch"),
        );
        if (indexOfEndSwitch === -1)
          throw new CodeError("Did not find endswitch statement.");

        const switchExpr = code[i]
          .split(" ")
          .filter((a) => !!a)
          .slice(1)
          .join(" ");

        const switchValue = evaluateExpression(switchExpr, lookup);
        const statements = parseBlockStatements(
          code.slice(i + 1, indexOfEndSwitch),
          "case",
          ["case"],
        );
        const returnValue = runSwitchStatement(statements, lookup, switchValue);
        if (returnValue) return returnValue;
        i = indexOfEndSwitch;
        break;
      }
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  return null;
}
