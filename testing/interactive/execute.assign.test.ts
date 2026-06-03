import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";

describe("code can execute assign on primitives", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("no params make new variable with primitive (number) and return", () => {
    const code = ["assign x = 15.25", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15.25");
  });
  it("no params make new variable with primitive (boolean) and return", () => {
    const code = ["assign x = false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("no params make new variable with primitive (string) and return", () => {
    const code = [`assign x = "this"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("this");
  });
});

describe("code can execute assign on variables", () => {
  const variableTests = [
    { paramType: "number", paramValue: "15.25", expected: "15.25" },
    { paramType: "boolean", paramValue: "true", expected: "true" },
    { paramType: "string", paramValue: "this", expected: "this" },
    {
      paramType: "enum",
      paramValue: "one",
      expected: "one",
      enumValues: ["one", "two"],
    },
  ];
  variableTests.forEach(({ paramType, paramValue, expected, enumValues }) => {
    it(`no params make new variable with param (${paramType}) and return`, () => {
      const paramDefs: ParamDef[] = enumValues
        ? [{ name: "lorem", type: paramType as any, values: enumValues }]
        : [{ name: "lorem", type: paramType as any }];
      const values: string[] = [paramValue];
      const code = ["assign x = lorem", "return x"];
      const modified = ExecuteCode(paramDefs, values, code);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("x");
      expect(modified[0].value).toBe(expected);
    });
  });
});

describe("assign throws errors when invalid structure", () => {
  const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
  const values: string[] = ["lorem value"];
  it("no equals sign", () => {
    const code = ["assign x 15"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
  it("nothing pre sign", () => {
    const code = ["assign = 15"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
  it("nothing post sign", () => {
    const code = ["assign x =   "];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not match assignment regex in assign block.",
    );
  });
});
