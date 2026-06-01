import { extractLabelAndValue } from "./Helpers/extractLabelAndValue";
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
  const splitString = code[0].split(" ").filter(a => !!a); // wow, that's impressive
  if (splitString[0] !== "return")
    throw new Error(`Cannot find keyword ${splitString[0]}.`); 

  const key = splitString.slice(1).join(" ");
  return [extractLabelAndValue(key, lookup)];
}


