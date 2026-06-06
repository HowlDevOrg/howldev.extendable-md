import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can run switch statements with literals (1 level)", () => {
  it("switch with string and inner return (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ['switch "this"', 'case "this"', "return true", "endswitch"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("switch with string and inner return (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ['switch "this"', 'case "that"', "return true", "endswitch"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find a return statement.",
    );
  });
  it("switch with number and inner return (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["switch 15", "case 15", "return true", "endswitch"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("switch with number and inner return (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["switch 15", "case 20", "return true", "endswitch"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find a return statement.",
    );
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
