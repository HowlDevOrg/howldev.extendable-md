import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/Helpers/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can run switch statements with literals (1 level)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("switch with string and inner return (true)", () => {
    const code = ['switch "this"', 'case "this"', "return true", "endswitch"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("switch with string and inner return (false)", () => {
    const code = ['switch "this"', 'case "that"', "return true", "endswitch"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find a return statement.",
    );
  });
  it("switch with number and inner return (true)", () => {
    const code = ["switch 15", "case 15", "return true", "endswitch"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("switch with number and inner return (false)", () => {
    const code = ["switch 15", "case 20", "return true", "endswitch"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find a return statement.",
    );
  });
  it("switch with number and multiple inner lines", () => {
    const code = ["switch 15", "case 15", "assign x = 5","assign y = 3","assign z = -2", "endswitch", "return x, y, z"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(3);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("5");
    expect(modified[1].label).toBe("y");
    expect(modified[1].value).toBe("3");
    expect(modified[2].label).toBe("z");
    expect(modified[2].value).toBe("-2");
  });
});

describe("code can run switch statements with literals (2 levels)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("switch with string and inner return (first)", () => {
    const code = [
      'switch "this"',
      'case "this"',
      "return true",
      `case "that"`,
      "return false",
      "endswitch",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("switch with string and inner return (second)", () => {
    const code = [
      'switch "that"',
      'case "this"',
      "return true",
      `case "that"`,
      "return false",
      "endswitch",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("false");
  });
  it("switch with string and inner assign (first)", () => {
    const code = [
      'switch "this"',
      'case "this"',
      "assign x = 5",
      `case "that"`,
      "assign x = 3",
      "endswitch",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("5");
  });
  it("switch with string and inner assign (second)", () => {
    const code = [
      'switch "that"',
      'case "this"',
      "assign x = 5",
      `case "that"`,
      "assign x = 3",
      "endswitch",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("3");
  });
  it("switch with string and multiple inner layers (first)", () => {
    const code = [
      'switch "this"',
      'case "this"',
      "assign x = 5",
      "assign y = 3",
      `case "that"`,
      "assign x = 3",
      "assign y = 5",
      "endswitch",
      "return x, y",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(2);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("5");
    expect(modified[1].label).toBe("y");
    expect(modified[1].value).toBe("3");
  });
  it("switch with string and multiple inner layers (second)", () => {
    const code = [
      'switch "that"',
      'case "this"',
      "assign x = 5",
      "assign y = 3",
      `case "that"`,
      "assign x = 3",
      "assign y = 5",
      "endswitch",
      "return x, y",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(2);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("3");
    expect(modified[1].label).toBe("y");
    expect(modified[1].value).toBe("5");
  });
});

describe("switch code can throws errors", () => {
  it("no endswitch", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ['switch "this"', 'case "this"', "assign x = 5"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find endswitch statement.",
    );
  });
  it("switch statement with different types fails (number and string)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["switch 15", 'case "this"', "return true", "endswitch"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Types do not match in switch expression: number (switch) and string (case).",
    );
  });
});
