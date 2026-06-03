import { CodeError } from "./customErrors";
import type { ParamDef } from "./types";

export function ParamDefSplitter(params: string[]): ParamDef[] {
  const result: ParamDef[] = [];
  for (const i of params) {
    const parts = i.split(":").map((a) => a.trim());
    if (parts.length != 2)
      throw new CodeError(`Unknown split result on parameter ${i}.`);
    switch (parts[1]) {
      case "string":
        result.push({
          name: parts[0],
          type: "string",
        });
        break;
      case "number":
        result.push({
          name: parts[0],
          type: "number",
        });
        break;
      case "boolean":
        result.push({
          name: parts[0],
          type: "boolean",
        });
        break;
      default: {
        const possibleEnums = parts[1].split("|").map((a) => a.trim());
        if (possibleEnums.length == 1) {
          throw new CodeError(
            `Can't determine type or create enum from type name ${parts[1]}.`,
          );
        }

        result.push({
          name: parts[0],
          type: "enum",
          values: possibleEnums,
        });
      }
    }
  }
  return result;
}
