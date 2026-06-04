import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

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

describe("code can execute return on primitives", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const primitives = [
    {
      description: "string without quotes",
      code: `return "This thing"`,
      expected: "This thing",
    },
    { description: "number (int)", code: "return 15", expected: "15" },
    { description: "number (float)", code: "return 15.25", expected: "15.25" },
    { description: "bool (true)", code: "return true", expected: "true" },
    { description: "bool (false)", code: "return false", expected: "false" },
  ];
  primitives.forEach(({ description, code, expected }) => {
    it(`no params/values returns ${description}`, () => {
      const codeArray = [code];
      const modified = ExecuteCode(paramDefs, values, codeArray);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("");
      expect(modified[0].value).toBe(expected);
    });
  });
});

describe("code can execute return on expressions", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const expressions = [
    {
      description: "addition expression",
      code: "return 15 + 23",
      expected: "38",
    },
    {
      description: "multiply expression",
      code: "return 4 * 5",
      expected: "20",
    },
    { description: "subtract expression", code: "return 4 - 2", expected: "2" },
    { description: "divide expression", code: "return 4 / 2", expected: "2" },
  ];
  expressions.forEach(({ description, code, expected }) => {
    it(description, () => {
      const codeArray = [code];
      const modified = ExecuteCode(paramDefs, values, codeArray);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("");
      expect(modified[0].value).toBe(expected);
    });
  });
});

describe("code can execute return with alias", () => {
  const primitives = [
    {
      description: "string as prim",
      code: `return "This thing" as item`,
      expected: "This thing",
    },
    {
      description: "number (int) as prim",
      code: "return 15 as item",
      expected: "15",
    },
    {
      description: "number (float) as prim",
      code: "return 15.25 as item",
      expected: "15.25",
    },
    {
      description: "bool (true) as prim",
      code: "return true as item",
      expected: "true",
    },
    {
      description: "bool (false) as prim",
      code: "return false as item",
      expected: "false",
    },
  ];
  primitives.forEach(({ description, code, expected }) => {
    it(`no params/values returns ${description}`, () => {
      const paramDefs: ParamDef[] = [];
      const values: string[] = [];
      const codeArray = [code];
      const modified = ExecuteCode(paramDefs, values, codeArray);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("item");
      expect(modified[0].value).toBe(expected);
    });
  });
  it("single string input works aliased", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["return Lorem as This Item"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("This Item");
    expect(modified[0].value).toBe("lorem value");
  });
});

describe("code can execute return on multiple inputs", () => {
  const paramDefs: ParamDef[] = [
    { name: "Lorem", type: "string" },
    { name: "Lorem2", type: "number" },
  ];
  const values: string[] = ["lorem value", "15.225"];
  it("string and number return first", () => {
    const code = ["return Lorem"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("lorem value");
  });
  it("string and number return second", () => {
    const code = ["return Lorem2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem2");
    expect(modified[0].value).toBe("15.225");
  });
});

describe("code can return multiple inputs", () => {
  const paramDefs: ParamDef[] = [
    { name: "Lorem", type: "string" },
    { name: "Lorem2", type: "number" },
  ];
  const values: string[] = ["lorem value", "15.225"];
  it("return string and number", () => {
    const code = ["return Lorem, Lorem2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(2);
    expect(modified[0].label).toBe("Lorem");
    expect(modified[0].value).toBe("lorem value");
    expect(modified[1].label).toBe("Lorem2");
    expect(modified[1].value).toBe("15.225");
  });
  it("return operator and function", () => {
    const code = ["return 15 * 2 + 3 as this, pow(2, 3)"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(2);
    expect(modified[0].label).toBe("this");
    expect(modified[0].value).toBe("33");
    expect(modified[1].label).toBe("");
    expect(modified[1].value).toBe("8");
  });
  it("return operator and function and string and number", () => {
    const code = ["return 15 * 2 + 3 as this, pow(2, 3), Lorem, Lorem2 as here we go!"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(4);
    expect(modified[0].label).toBe("this");
    expect(modified[0].value).toBe("33");
    expect(modified[1].label).toBe("");
    expect(modified[1].value).toBe("8");
    expect(modified[2].label).toBe("Lorem");
    expect(modified[2].value).toBe("lorem value");
    expect(modified[3].label).toBe("here we go!");
    expect(modified[3].value).toBe("15.225");
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

describe("code throws errors when return is misspelled", () => {
  const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
  const values: string[] = ["lorem value"];
  it("retun function", () => {
    const code = ["retun not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find keyword retun.",
    );
  });
  it("retun function with some extra spaces", () => {
    const code = ["  retun        not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find keyword retun.",
    );
  });
});
