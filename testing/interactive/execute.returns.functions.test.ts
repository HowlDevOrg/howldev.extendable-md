import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";
import { evaluateFunctions } from "../../lib/logic/Interactive/Helpers/evaluateFunctions";
import { evaluateExpression } from "../../lib/logic/Interactive/Helpers/evaluateExpression";

describe("code can run simple functions with prims", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const functions = [
    {
      name: "e()",
      code: "return e()",
      check: (val: string) => expect(val.slice(0, 4)).toBe("2.71"),
    },
    {
      name: "pi()",
      code: "return pi()",
      check: (val: string) => expect(val.slice(0, 4)).toBe("3.14"),
    },
    {
      name: "sqrt()",
      code: "return sqrt(16)",
      check: (val: string) => expect(val).toBe("4"),
    },
    {
      name: "sin()",
      code: "return sin(0)",
      check: (val: string) => expect(val).toBe("0"),
    },
    {
      name: "cos()",
      code: "return cos(0)",
      check: (val: string) => expect(val).toBe("1"),
    },
    {
      name: "tan()",
      code: "return tan(0)",
      check: (val: string) => expect(val).toBe("0"),
    },
    {
      name: "round(1.5)",
      code: "return round(1.5)",
      check: (val: string) => expect(val).toBe("2"),
    },
    {
      name: "round(200.1)",
      code: "return round(200.1)",
      check: (val: string) => expect(val).toBe("200"),
    },
    {
      name: "floor(1.5)",
      code: "return floor(1.5)",
      check: (val: string) => expect(val).toBe("1"),
    },
    {
      name: "floor(200.1)",
      code: "return floor(200.1)",
      check: (val: string) => expect(val).toBe("200"),
    },
    {
      name: "ceil(1.5)",
      code: "return ceil(1.5)",
      check: (val: string) => expect(val).toBe("2"),
    },
    {
      name: "ceil(200.1)",
      code: "return ceil(200.1)",
      check: (val: string) => expect(val).toBe("201"),
    },
    {
      name: "degtorad(180)",
      code: "return degtorad(180)",
      check: (val: string) => expect(val.slice(0, 4)).toBe("3.14"),
    },
    {
      name: "radtodeg(2.0943951024)",
      code: "return radtodeg(2.0943951024)",
      check: (val: string) => expect(val.slice(0, 5)).toBe("120.0"),
    },
    {
      name: "log(100)",
      code: "return log(100)",
      check: (val: string) => expect(val).toBe("2"),
    },
    {
      name: "log2(64)",
      code: "return log2(64)",
      check: (val: string) => expect(val).toBe("6"),
    },
    {
      name: "ln(20)",
      code: "return ln(20)",
      check: (val: string) => expect(val).toBe(Math.log(20).toString()),
    },
    {
      name: "abs(-120)",
      code: "return abs(-120)",
      check: (val: string) => expect(val).toBe("120"),
    },
    {
      name: "pow(3, 2)",
      code: "return pow(3, 2)",
      check: (val: string) => expect(val).toBe("9"),
    },
    {
      name: "atan2(10, 5)",
      code: "return atan2(10, 5)",
      check: (val: string) => expect(val).toBe("1.1071487177940904"),
    },
    {
      name: "isEmpty(\"\")",
      code: "return isEmpty(\"\")",
      check: (val: string) => expect(val).toBe("true"),
    },
    {
      name: "isEmpty(\"this\")",
      code: "return isEmpty(\"this\")",
      check: (val: string) => expect(val).toBe("false"),
    },
    {
      name: "isNotEmpty(\"\")",
      code: "return isNotEmpty(\"\")",
      check: (val: string) => expect(val).toBe("false"),
    },
    {
      name: "isNotEmpty(\"this\")",
      code: "return isNotEmpty(\"this\")",
      check: (val: string) => expect(val).toBe("true"),
    },
    {
      name: "len(\"first\")",
      code: "return len(\"first\")",
      check: (val: string) => expect(val).toBe("5"),
    },
    {
      name: "len(\"o\")",
      code: "return len(\"o\")",
      check: (val: string) => expect(val).toBe("1"),
    },
  ];
  functions.forEach((func) => {
    it(func.name, () => {
      const code = [func.code];
      const modified = ExecuteCode(paramDefs, values, code);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("");
      func.check(modified[0].value);
    });
  });
});

describe("code can run stringify functions", () => {
  it("Can stringify number", () => {
    const modified = evaluateExpression("str(45.2)", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("string");
    expect(modified.value).toBe("45.2");
  });
  it("Can stringify boolean (true)", () => {
    const modified = evaluateExpression("str(true)", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("string");
    expect(modified.value).toBe("true");
  });
  it("Can stringify boolean (false)", () => {
    const modified = evaluateExpression("str(false)", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("string");
    expect(modified.value).toBe("false");
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
    "abs",
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

  const stringFunctions = [
    "isEmpty",
    "isNotEmpty",
    "len",
  ];
  stringFunctions.forEach((func) => {
    it(`${func} (number)`, () => {
      const code = [`return ${func}(45.2)`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Can't get string from value 45.2 in function ${func}.`,
      );
    });

    it(`${func} (boolean)`, () => {
      const code = [`return ${func}(true)`];
      expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
        `Can't get string from value true in function ${func}.`,
      );
    });
  });

  it("pow doesn't work with only 1 input", () => {
    const code = ["return pow(3)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Pow needs 2 number operands.",
    );
  });

  it("pow doesn't work with 3 inputs", () => {
    const code = ["return pow(3, 4, 5)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Pow needs 2 number operands.",
    );
  });

  it("pow doesn't work with non-number inputs 1", () => {
    const code = ["return pow(3, \"4\")"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't get number from value 4 in function pow.",
    );
  });
  it("pow doesn't work with non-number inputs 2", () => {
    const code = ["return pow(true, 4)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't get number from value true in function pow.",
    );
  });

  it("atan2 doesn't work with only 1 input", () => {
    const code = ["return atan2(3)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Atan2 needs 2 number operands.",
    );
  });

  it("atan2 doesn't work with 3 inputs", () => {
    const code = ["return atan2(3, 4, 5)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Atan2 needs 2 number operands.",
    );
  });

  it("atan2 doesn't work with non-number inputs 1", () => {
    const code = ["return atan2(3, \"4\")"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't get number from value 4 in function atan2.",
    );
  });
  it("atan2 doesn't work with non-number inputs 2", () => {
    const code = ["return atan2(true, 4)"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't get number from value true in function atan2.",
    );
  });
});
