import { extractLabelAndValue } from "./extractLabelAndValue";

// eslint-disable-next-line
export function evaluateExpression(possibleExp: string, lookup: any): string {
  const operatorRegex = /(.*)(!=|={2}|<=?|>=?|\*|-|\+|\/|%)(.*)/;
  const match = possibleExp.match(operatorRegex);
  if (match) {
    switch (match[2]) {
      case "+":
        const [sum1, sum2] = GetNumbers(match[1], match[3]);
        return (sum1 + sum2).toString();
      case "-":
        const [sub1, sub2] = GetNumbers(match[1], match[3]);
        return (sub1 - sub2).toString();
      case "*":
        const [times1, times2] = GetNumbers(match[1], match[3]);
        return (times1 * times2).toString();
      case "/":
        const [div1, div2] = GetNumbers(match[1], match[3]);
        return (div1 / div2).toString();
      case "%":
        const [mod1, mod2] = GetNumbers(match[1], match[3]);
        return (mod1 % mod2).toString();
      default:
        throw new Error(
          `Unreachable error: Could not find operator ${match[2]}`,
        );
    }
  } else {
    return extractLabelAndValue(possibleExp, lookup).value;
  }
}

function GetNumbers(str1: string, str2: string): number[] {
  return [GetSingleNumber(str1), GetSingleNumber(str2)];
}

function GetSingleNumber(str: string): number {
  if (Number(str)) {
    return Number(str);
  }
  throw new Error(`Could not parse ${str} as number.`);
}
