import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";

describe("code can execute math operators on other side of assign", () => {
  it("can execute 2 + 3", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 + 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("5");
  });
  it("can execute 2 * 3", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 * 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("6");
  });
  it("can execute 2 - 3", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 - 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("-1");
  });
  it("can execute 2 / 3", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 / 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("0.6666666666666666");
  });
  it("can execute 5 % 3", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 5 % 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("2");
  });
});

// Executed left to right
describe("code can execute multiple math operators on other side of assign", () => {
  it("can execute 2 + 3 * 5", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 + 3 * 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("25");
  });
  it("can execute 2 * 3 + 5", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = ["assign x = 2 * 3 + 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("11");
  });
});
