import { ParamDef } from "../types";

export function getDefault(a: ParamDef): string {
  switch (a.type) {
    case "string":
      return "";
    case "boolean":
      return "false";
    case "number":
      return "0";
    case "enum":
      return a.values[0];
  }
}
