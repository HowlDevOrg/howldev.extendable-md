import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can throw", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can throw with short string", () => {
    const code = ["throw This is what I expect."];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "User Error: This is what I expect.",
    );
  });
  it("can throw with longer string", () => {
    const code = [
      "throw Did not get a valid number. Please have it between 0 and 360.",
    ];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Did not get a valid number. Please have it between 0 and 360.",
    );
  });
});

describe("code can throw if outside range", () => {
  it("primitive throws for range keyword (lower)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["throwIfOutsideRange 15, 20, 50"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 is outside of range 20 - 50.",
    );
  });
  it("primitive throws for range keyword (upper)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["throwIfOutsideRange 15, 10, 12"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 is outside of range 10 - 12.",
    );
  });
  it("primitive doesn't throw if within range", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["throwIfOutsideRange 15, 10, 50", "return 15"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("15");
  });
  it("variable throws for range keyword (lower)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
    const values: string[] = ["15"];
    const code = ["throwIfOutsideRange lorem, 20, 50"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 (lorem) is outside of range 20 - 50.",
    );
  });
  it("variable throws for range keyword (upper)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
    const values: string[] = ["15"];
    const code = ["throwIfOutsideRange lorem, 10, 12"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 (lorem) is outside of range 10 - 12.",
    );
  });
  it("variable doesn't throw if within range", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
    const values: string[] = ["15"];
    const code = ["throwIfOutsideRange lorem, 10, 50", "return lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("lorem");
    expect(modified[0].value).toBe("15");
  });
  it("variable (string) throws for range keyword (lower)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
    const values: string[] = ["123456789012345"];
    const code = ["throwIfOutsideRange len(lorem), 20, 50"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 is outside of range 20 - 50.",
    );
  });
  it("variable (string) throws for range keyword (upper)", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
    const values: string[] = ["123456789012345"];
    const code = ["throwIfOutsideRange len(lorem), 10, 12"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "15 is outside of range 10 - 12.",
    );
  });
  it("variable (string) doesn't throw if within range", () => {
    const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
    const values: string[] = ["123456789012345"];
    const code = ["throwIfOutsideRange len(lorem), 10, 50", "return lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("lorem");
    expect(modified[0].value).toBe("123456789012345");
  });
});

describe("code throw if outside range has other errors", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("primitive throws for range keyword 1", () => {
    const code = ['throwIfOutsideRange "15", 20, 50'];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      'Code Error: Value "15" must be of type number in throwIfOutsideRange.',
    );
  });
  it("primitive throws for range keyword 2", () => {
    const code = ['throwIfOutsideRange 15, "20", 50'];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      'Code Error: Value "20" must be of type number in throwIfOutsideRange.',
    );
  });
  it("primitive throws for range keyword 3", () => {
    const code = ['throwIfOutsideRange 15, 20, "50"'];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      'Code Error: Value "50" must be of type number in throwIfOutsideRange.',
    );
  });
});
