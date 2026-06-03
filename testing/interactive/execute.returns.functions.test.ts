import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";

describe("code can run simple functions with prims", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("e()", () => {
    const code = ["return e()"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value.slice(0, 4)).toBe("2.71");
  });
  it("pi()", () => {
    const code = ["return pi()"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value.slice(0, 4)).toBe("3.14");
  });
  it("sqrt()", () => {
    const code = ["return sqrt(16)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("4");
  });
  it("sin()", () => {
    const code = ["return sin(0)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("0");
  });
  it("cos()", () => {
    const code = ["return cos(0)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("1");
  });
  it("tan()", () => {
    const code = ["return tan(0)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("0");
  });
  it("round(1.5)", () => {
    const code = ["return round(1.5)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
  it("round(200.1)", () => {
    const code = ["return round(200.1)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("200");
  });
  it("floor(1.5)", () => {
    const code = ["return floor(1.5)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("1");
  });
  it("floor(200.1)", () => {
    const code = ["return floor(200.1)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("200");
  });
  it("ceil(1.5)", () => {
    const code = ["return ceil(1.5)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
  it("ceil(200.1)", () => {
    const code = ["return ceil(200.1)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("201");
  });
  it("degtorad(180)", () => {
    const code = ["return degtorad(180)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value.slice(0, 4)).toBe("3.14");
  });
  it("radtodeg(2.0943951024)", () => {
    const code = ["return radtodeg(2.0943951024)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value.slice(0, 5)).toBe("120.0");
  });
  it("log(100)", () => {
    const code = ["return log(100)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
  it("log2(64)", () => {
    const code = ["return log2(64)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("6");
  });
  it("ln(20)", () => {
    const code = ["return ln(20)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe(Math.log(20).toString());
  });
});

describe("code can run simple functions with prims and outside operators", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("e() minus e()", () => {
    const code = ["return e() - e()"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("0");
  });
  it("e() times 0", () => {
    const code = ["return e() * 0"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("0");
  });
});

describe("code can run simple functions with inside and outside operators", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("sqrt 1", () => {
    const code = ["return sqrt(20 - 4) - 2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
  it("sqrt 2", () => {
    const code = ["return sqrt(6 * 6) * 2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("12");
  });
});

describe("code throws errors on invalid function bases", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("invalid name (nothing)", () => {
    const code = ["return nothing()"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Couldn't find function name nothing.",
    );
  });
});

describe("code throws errors on invalid inputs", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("e with params", () => {
    const code = ['return e("this")'];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Don't include any parameters with the function e.",
    );
  });
  it("pi with params", () => {
    const code = ['return pi("this")'];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Don't include any parameters with the function pi.",
    );
  });

  const numberFunctions = [
    "sqrt",
    "sin",
    "cos",
    "tan",
    "round",
    "floor",
    "ceil",
    "degtorad",
    "radtodeg",
    "log",
    "log2",
    "ln",
  ];
  numberFunctions.forEach((func) => {
    it(`${func} (string)`, () => {
      const code = [`return ${func}("this")`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Can't get number from value this in function ${func}.`,
      );
    });

    it(`${func} (boolean)`, () => {
      const code = [`return ${func}(true)`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Can't get number from value true in function ${func}.`,
      );
    });
  });
});
