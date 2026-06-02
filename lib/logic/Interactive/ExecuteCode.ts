import { evaluateExpression } from "./Helpers/evaluateExpression";
import { extractLabelAndValue } from "./Helpers/extractLabelAndValue";
import { paramDefAndValueToStructuredOutput } from "./Helpers/stringHelpers";
import {
  ExecutionReturn,
  ObjectWithStructuredValue,
  ParamDef,
  StructuredReturn,
} from "./types";

export function ExecuteCode(
  paramDef: ParamDef[],
  values: string[],
  code: string[],
): ExecutionReturn[] {
  if (paramDef.length !== values.length)
    throw new Error("Arrays are not of equal size.");
  const lookup: ObjectWithStructuredValue = {};
  for (let i = 0; i < paramDef.length; i++) {
    lookup[paramDef[i].name] = paramDefAndValueToStructuredOutput(
      paramDef[i],
      values[i],
    );
  }
  for (let i = 0; i < code.length; i++) {
    const splitString = code[i].split(" ").filter((a) => !!a);
    const key = splitString.slice(1).join(" ");
    switch (splitString[0]) {
      case "return":
        const vals = extractLabelAndValue(key, lookup);
        return [{ label: vals.label, value: StructuredReturnToString(vals) }];
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

function StructuredReturnToString(val: StructuredReturn): string {
  switch (val.type) {
    case "string":
      return val.value as string;
    case "bool":
      return val.value ? "true" : "false";
    case "number":
      return val.value.toString();
  }
}
