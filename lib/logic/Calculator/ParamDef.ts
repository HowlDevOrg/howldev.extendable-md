import { CodeError } from "./customErrors";
import type { ParamDef } from "./types";

export function ParamDefSplitter(params: string[]): ParamDef[] {
  const result: ParamDef[] = [];
  for (const i of params) {
    const parts = i
      .split(":")
      .map((a) => a.trim());
    if (parts.length != 2)
      throw new CodeError(`Unknown split result on parameter ${i}.`);

    const possibleDefaults = parts[1].split("=").map((a) => a.trim());
    if (possibleDefaults.length == 1) {
      result.push(getParameter(parts));
    } else if (possibleDefaults.length == 2) {
      result.push(getParameter([parts[0], possibleDefaults[0]], possibleDefaults[1]));
    }
  }
  return result;
}

function getParameter(
  parts: string[],
  defValue: string | undefined = undefined,
): ParamDef {
  switch (parts[1]) {
    case "string":
      return {
        name: parts[0],
        type: "string",
        default: defValue ? defValue : "",
      };
    case "number":
      return {
        name: parts[0],
        type: "number",
        default: defValue ? defValue : "0",
      };
    case "boolean":
      return {
        name: parts[0],
        type: "boolean",
        default: defValue ? defValue : "false",
      };
    default: {
      const possibleEnums = parts[1].split("|").map((a) => a.trim());
      if (possibleEnums.length == 1) {
        throw new CodeError(
          `Can't determine type or create enum from type name ${parts[1]}.`,
        );
      }

      return {
        name: parts[0],
        type: "enum",
        values: possibleEnums,
        default: defValue ? defValue : possibleEnums[0],
      };
    }
  }
}
