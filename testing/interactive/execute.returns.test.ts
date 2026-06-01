import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";

describe("code can execute return on single inputs", () => {
  it("single string input works", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("lorem value");
  });
  it("empty string input works", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = [""];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("");
  });
  it("single boolean input works", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "boolean" }];
    const values: string[] = ["true"];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("true");
  });
  it("single number input works", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "number" }];
    const values: string[] = ["15.12"];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("15.12");
  });
  it("single enum input works", () => {
    const paramDefs: ParamDef[] = [
      { name: "Lorem", type: "enum", values: ["one", "two"] },
    ];
    const values: string[] = ["two"];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("two");
  });
  it("key with space works properly", () => {
    const paramDefs: ParamDef[] = [
      { name: "Found Item", type: "enum", values: ["one", "two"] },
    ];
    const values: string[] = ["two"];
    const code = ["return Found Item"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Found Item");
    expect(modified[0].value).toBe("two");
  });
});

describe("code can execute return on multiple inputs", () => {
  it("string and number return first", () => {
    const paramDefs: ParamDef[] = [
      { name: "Lorem", type: "string" },
      { name: "Lorem2", type: "number" },
    ];
    const values: string[] = ["lorem value", "part 2"];
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("lorem value");
  });
  it("string and number return second", () => {
    const paramDefs: ParamDef[] = [
      { name: "Lorem", type: "string" },
      { name: "Lorem2", type: "number" },
    ];
    const values: string[] = ["lorem value", "part 2"];
    const code = ["return Lorem2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem2");
    expect(modified[0].value).toBe("part 2");
  });
});

describe("code throws errors when param not found", () => {
  it("unknown name", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["return not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find key not Found.",
    );
  });
  it("unequal array length (lower)", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = [];
    const code = ["return not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Arrays are not of equal size.",
    );
  });
  it("unequal array length (higher)", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value", "wrong value"];
    const code = ["return not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Arrays are not of equal size.",
    );
  });
});
