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
  const key = code[0].split(" ").slice(1).join(" ");
  if (!(key in lookup)) throw new Error(`Cannot find key ${key}.`);
  return [{ label: key, value: lookup[key] }];
}
