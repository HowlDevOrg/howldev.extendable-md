import { UserError, CodeError } from "./customErrors";
import { evaluateExpression } from "./Helpers/evaluateExpression";
import { parseIfElseStatements } from "./Helpers/stringHelpers";
import { getReturnArray, throwIfOutsideRange, assignIntoLookup } from "./keywordFuncs";
import { ObjectWithStructuredValue, ExecutionReturn } from "./types";

export function executeInstructions(
  code: string[],
  lookup: ObjectWithStructuredValue): ExecutionReturn[] | null {
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
          (a, nI) => nI >= i && a.startsWith("endif")
        );
        if (indexOfEndif === -1)
          throw new CodeError("Did not find endif statement.");
        
        const statements = parseIfElseStatements(code.slice(i, indexOfEndif));
        for (const codeArray of statements) {
          const fsa = codeArray[0].split(" ").filter((a) => !!a);
          if (fsa[0].toLowerCase() !== "else") {
            const newExprValue = fsa.slice(1).join(" ");
            const evaluation = evaluateExpression(newExprValue, lookup);
            if (evaluation.type === "bool") {
              if (evaluation.value as boolean) {
                const newCode = codeArray.slice(1);
                const returnValue = executeInstructions(newCode, lookup);
                if (returnValue) return returnValue;
                break;
              }
            } else {
              throw new CodeError(
                `Cannot interpret type ${evaluation.type} as a boolean in an if statement.`
              );
            }
          } else {
            const newCode = codeArray.slice(1);
            const returnValue = executeInstructions(newCode, lookup);
            if (returnValue) return returnValue;
          }
        }
        i = indexOfEndif;
        break;
      }
      default:
        throw new CodeError(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  return null;
}
