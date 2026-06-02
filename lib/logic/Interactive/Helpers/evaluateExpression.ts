import { StructuredOutput } from "../types";
import { extractLabelAndValue } from "./extractLabelAndValue";

// eslint-disable-next-line
export function evaluateExpression(possibleExp: string, lookup: any): StructuredOutput {
  const operatorRegex = /(.*)(!=|={2}|<=?|>=?|\*|-|\+|\/|%)(.*)/;
  const match = possibleExp.match(operatorRegex);
  if (match) {
    switch (match[2]) {
      case "+":
        const [sum1, sum2] = GetNumbers(match[1], match[3]);
        return {value: (sum1 + sum2).toString(), type: "number"};
      case "-":
        const [sub1, sub2] = GetNumbers(match[1], match[3]);
        return {value: (sub1 - sub2).toString(), type: "number"};
      case "*":
        const [times1, times2] = GetNumbers(match[1], match[3]);
        return {value: (times1 * times2).toString(), type: "number"};
      case "/":
        const [div1, div2] = GetNumbers(match[1], match[3]);
        return {value: (div1 / div2).toString(), type: "number"};
      case "%":
        const [mod1, mod2] = GetNumbers(match[1], match[3]);
        return {value: (mod1 % mod2).toString(), type: "number"};
      default:
        throw new Error(
          `Unknown operator error: Could not find operator ${match[2]}`,
        );
    }
  } else {
    const val = extractLabelAndValue(possibleExp, lookup);
    return {value: val.value, type: val.type };
  }
}

function GetNumbers(str1: string, str2: string): number[] {
  return [GetSingleNumber(str1), GetSingleNumber(str2)];
}

export function GetSingleNumber(str: string): number {
  if (Number(str)) {
    return Number(str);
  }
  throw new Error(`Could not parse ${str} as number.`);
}
