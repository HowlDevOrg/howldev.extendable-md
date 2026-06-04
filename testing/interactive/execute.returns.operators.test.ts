import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";
import { evaluateExpression } from "../../lib/logic/Calculator/Helpers/evaluateExpression";

describe("code can alias generic functions on return", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 + 3 as result", () => {
    const code = ["return 2 + 3 as result"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("result");
    expect(modified[0].value).toBe("5");
  });
  it("can execute 2 + 3 * 5 as result", () => {
    const code = ["return 2 + 3 * 5 as result"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("result");
    expect(modified[0].value).toBe("17");
  });
});

describe("code can run operators inside parenthesis", () => {
  const expressions = [
    { expression: "2 + 3 * 5", expected: 17 },
    { expression: "2 + (3 * 5)", expected: 17 },
    { expression: "(2 + 3) * 5", expected: 25 },
    { expression: "(2 + (3 - 1)) / 4", expected: 1 },
    { expression: "(5 + 3) / 2", expected: 4 },
    { expression: "((2 + 3) * 4) - 5", expected: 15 },
    { expression: "(10 - 2) * 3", expected: 24 },
    { expression: "6 / (3 - 1)", expected: 3 },
    { expression: "(4 + 6) * (2 + 1)", expected: 30 },
    { expression: "100 / (2 * (2 + 3))", expected: 10 },
    { expression: "(15 - 3) / (2 + 2)", expected: 3 },
    { expression: "5 * (2 + 2) - 10", expected: 10 },
    { expression: "((8 - 2) * 3 + 6)", expected: 24 },
    { expression: "(20 / (2 + 3)) * 2", expected: 8 },
  ];
  expressions.forEach((exp) => {
    it(`can execute ${exp.expression}`, () => {
      const modified = evaluateExpression(exp.expression, {});
      expect(modified.label).toBe("");
      expect(modified.type).toBe("number");
      expect(modified.value).toBe(exp.expected);
    });
  });
});

describe("code throws errors on mismatched types", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("number and string", () => {
    const code = [`return 15 < "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator < on types number and string.",
    );
  });
  it("number and bool", () => {
    const code = [`return 15 + true`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator + on types number and bool.",
    );
  });
  it("string and bool", () => {
    const code = [`return "hello" == true`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator == on types string and bool.",
    );
  });
  it("bool and string", () => {
    const code = [`return true < "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator < on types bool and string.",
    );
  });
});

describe("code throws errors for numeric operators when not number (string)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const invalidStringOperators = ["-", "*", "/", "%", "<", ">", "<=", ">="];
  invalidStringOperators.forEach((op) => {
    it(`${op} operator`, () => {
      const code = [`return "13" ${op} "hello"`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Type string is not valid for operator ${op}.`,
      );
    });
  });
});

describe("code throws errors for numeric operators when not number (boolean)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const invalidBoolOperators = ["-", "*", "/", "%", "<", ">", "<=", ">="];
  invalidBoolOperators.forEach((op) => {
    it(`${op} operator`, () => {
      const code = [`return true ${op} false`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Type bool is not valid for operator ${op}.`,
      );
    });
  });
});
