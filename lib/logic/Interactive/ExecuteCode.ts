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
  let returnLabel, returnValue;

  if (key.startsWith('"') && key.endsWith('"')) {
    returnValue = key.slice(1, key.length - 1);
    returnLabel = "";
  } else if (Number(key)) {
    returnValue = Number(key).toString();
    returnLabel = "";
  } else if (key === "true" || key === "false") {
    returnValue = key;
    returnLabel = "";
  } else if (!(key in lookup)) {
    throw new Error(`Cannot find key ${key}.`);
  } else {
    returnLabel = key;
    returnValue = lookup[key];
  }

  return [{ label: returnLabel, value: returnValue }];
}
