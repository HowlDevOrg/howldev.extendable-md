import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";

describe("code can execute return on single inputs", () => {
  it("no params make new variable with primitive (number) and return", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 15.25", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15.25");
  });
  it("no params make new variable with primitive (boolean) and return", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("no params make new variable with primitive (string) and return", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`assign x = "this"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("this");
  });
});

describe("code can execute return on single params", () => {
  it("no params make new variable with param (number) and return", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
    const values: string[] = ["15.25"];
    const code = ["assign x = lorem", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15.25");
  });
  it("no params make new variable with param (boolean) and return", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "boolean" }];
    const values: string[] = ["true"];
    const code = ["assign x = lorem", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("no params make new variable with param (string) and return", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
    const values: string[] = ["this"];
    const code = ["assign x = lorem", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("this");
  });
  it("no params make new variable with param (enum) and return", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "enum", values: ["one", "two"] }];
    const values: string[] = ["one"];
    const code = ["assign x = lorem", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("one");
  });
});

describe("assign throws errors when invalid structure", () => {
  it("no equals sign", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["assign x 15"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
  it("nothing pre sign", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["assign = 15"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
  it("nothing post sign", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["assign x =   "];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
});
