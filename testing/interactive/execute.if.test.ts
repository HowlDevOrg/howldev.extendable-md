import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can run if statements", () => {
  it("if with number check and inner return (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["if 15 > 5", "return true", "else", "return false", "endif"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("if with number check and inner return (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["if 15 < 5", "return true", "else", "return false", "endif"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("false");
  });
  it("if with assignments and global return (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 15 > 5",
      "assign x = 15",
      "else",
      "assign x = 3",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15");
  });
  it("if with assignments and global return (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 15 < 5",
      "assign x = 15",
      "else",
      "assign x = 3",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("3");
  });
  it("if with parameter (true)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "boolean" }];
    const values: string[] = ["true"];
    const code = [
      "if lorem",
      "assign x = 15",
      "else",
      "assign x = 3",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15");
  });
  it("if with parameter (false)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "boolean" }];
    const values: string[] = ["false"];
    const code = [
      "if lorem",
      "assign x = 15",
      "else",
      "assign x = 3",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("3");
  });
  it("endif gets the correct block", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 15 > 3",
      "assign x = 5",
      "endif",
      "if 3 < 5",
      "assign x = x + 2",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("7");
  });
});

describe("code can run multiple lines", () => {
  it("can run multiple statements inside lone if", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 3 < 15",
      "assign x = 15",
      "assign y = 32.6",
      "assign z = 1",
      "endif",
      "return x, y, z as newZ",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(3);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15");
    expect(modified[1].label).toBe("y");
    expect(modified[1].value).toBe("32.6");
    expect(modified[2].label).toBe("newZ");
    expect(modified[2].value).toBe("1");
  });
  it("can run multiple statements inside else (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 3 > 15",
      "assign x = -2",
      "else",
      "assign x = 15",
      "assign y = 32.6",
      "assign z = 1",
      "endif",
      "return x, y, z",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(3);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15");
    expect(modified[1].label).toBe("y");
    expect(modified[1].value).toBe("32.6");
    expect(modified[2].label).toBe("z");
    expect(modified[2].value).toBe("1");
  });
  it("can run multiple statements inside else (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 3 < 15",
      "assign x = -2",
      "else",
      "assign x = 15",
      "assign y = 32.6",
      "assign z = 1",
      "endif",
      "return x",
    ];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("-2");
  });
});

describe("code can throws errors in if if not booleans", () => {
  it("if is number", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["if 15", "else", "endif", "return 1"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot interpret type number as a boolean in an if statement.",
    );
  });
  it("if is number as parameter", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
    const values: string[] = ["15"];
    const code = ["if lorem", "else", "endif", "return 1"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot interpret type number as a boolean in an if statement.",
    );
  });
  it("if is string", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ['if "this"', "else", "endif", "return 1"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot interpret type string as a boolean in an if statement.",
    );
  });
  it("if is string as parameter", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
    const values: string[] = ["this"];
    const code = ["if lorem", "else", "endif", "return 1"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot interpret type string as a boolean in an if statement.",
    );
  });
});

describe("code can throws errors if not finding correct lines", () => {
  it("no endif", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["if 15 < 3", "assign x = 5"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not find endif statement.",
    );
  });
  it("endif before if block", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["endif", "if 15 < 3", "assign x = 5"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find keyword endif.",
    );
  });
  it("throws errors if variables aren't set in both", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [
      "if 3 < 15",
      "assign x = -2",
      "else",
      "assign x = 15",
      "assign y = 32.6",
      "assign z = 1",
      "endif",
      "return x, y, z",
    ];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find key y.",
    );
  });
});
