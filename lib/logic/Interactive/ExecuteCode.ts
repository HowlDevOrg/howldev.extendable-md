import { evaluateExpression } from "./Helpers/evaluateExpression";
import { extractLabelAndValue } from "./Helpers/extractLabelAndValue";
import { getInnerString, isQuotedString } from "./Helpers/stringHelpers";
import { ParamDef } from "./types";

export type ExecutionReturn = {
  label: string;
  value: string;
};

export function ExecuteCode(
  paramDef: ParamDef[],
  values: string[],
  code: string[],
): ExecutionReturn[] {
  if (paramDef.length !== values.length)
    throw new Error("Arrays are not of equal size.");
  // eslint-disable-next-line
  const lookup: any = {};
  for (let i = 0; i < paramDef.length; i++) {
    lookup[paramDef[i].name] = values[i];
  }
  for (let i = 0; i < code.length; i++) {
    const splitString = code[i].split(" ").filter((a) => !!a); 
    const key = splitString.slice(1).join(" ");
    switch (splitString[0]) {
      case "return":
        return [extractLabelAndValue(key, lookup)];
      case "assign":
        const assignRegex = /(.*)=(.*)/;
        const match = key.match(assignRegex);
        if (match && match[1] && match[2]) {
          lookup[match[1].trim()] = evaluateExpression(match[2].trim(), lookup);
        } else {
          throw new Error("Did not match assignment regex in assign block.");
        }
        break;
      default:
        throw new Error(`Cannot find keyword ${splitString[0]}.`);
    }
  }
  throw new Error("Did not find a return statement.");
}
