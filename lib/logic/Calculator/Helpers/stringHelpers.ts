import { InternalError } from "../customErrors";
import { ParamDef, StructuredOutput } from "../types";

export function getInnerString(key: string): string {
  return key.slice(1, key.length - 1);
}
export function isQuotedString(key: string) {
  return key.startsWith('"') && key.endsWith('"');
}
export function paramDefAndValueToStructuredOutput(
  param: ParamDef,
  value: string,
): StructuredOutput {
  switch (param.type) {
    case "string":
      return { value: value, type: "string" };
    case "boolean":
      return { value: value === "true" ? true : false, type: "bool" };
    case "number":
      return { value: GetSingleNumber(value), type: "number" };
    case "enum":
      return { value: value, type: "string" };
  }
}

export function GetSingleNumber(str: string): number {
  if (!isNaN(Number(str))) {
    return Number(str);
  }
  throw new InternalError(`Could not parse ${str} as number.`);
}
