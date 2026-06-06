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
      if (!isNaN(Number(value))) {
        return { value: Number(value), type: "number" };
      }
      throw new InternalError(`Could not parse ${value} as number.`);
    case "enum":
      return { value: value, type: "string" };
  }
}

export function parseIfElseStatements(
  ifElseCode: string[],
  start: string,
  splitItems: string[],
): string[][] {
  if (ifElseCode.length === 0)
    throw new InternalError("Length of ifElse code should not be 0.");
  if (!ifElseCode[0].trimStart().toLowerCase().startsWith(start))
    throw new InternalError(
      `${start.charAt(0).toUpperCase() + start.slice(1)} statement does not start with a(n) ${start} statement. Instead started with: ${ifElseCode[0]}.`,
    );
  if (ifElseCode.includes("endif"))
    throw new InternalError("Parser code should not have endif included.");

  const wholeReturn: string[][] = [];
  let internalReturn: string[] = [ifElseCode[0]];
  for (let i = 1; i < ifElseCode.length; i++) {
    if (
      splitItems.includes(ifElseCode[i].trimStart().toLowerCase().split(" ")[0])
    ) {
      wholeReturn.push(internalReturn);
      internalReturn = [];
    }

    internalReturn.push(ifElseCode[i]);
  }
  wholeReturn.push(internalReturn);
  return wholeReturn;
}

// AI generated
export function splitOnOutermostCommas(input: string): string[] {
  const result: string[] = [];
  let depth = 0,
    start = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === "(") depth++;
    else if (input[i] === ")") depth--;
    else if (input[i] === "," && depth === 0) {
      result.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }
  result.push(input.slice(start).trim());
  return result;
}
