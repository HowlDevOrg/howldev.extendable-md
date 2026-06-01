import { ParamDefSplitter } from "./ParamDef";
import { ParamDef } from "./types";

export function parseParamsAndCode(text: string): {
  newParams: ParamDef[];
  newCode: string[];
} {
  const newParamsRaw: string[] = [];
  const newCode: string[] = [];
  const items = text.split("\n");
  let params = true;
  for (let i = 0; i < items.length; i++) {
    if (!items[i]) continue; // null or whitespace

    if (items[i] === "---") {
      params = false;
    } else if (params) {
      newParamsRaw.push(items[i]);
    } else {
      newCode.push(items[i]);
    }
  }
  const newParams = ParamDefSplitter(newParamsRaw);
  return { newParams, newCode };
}
