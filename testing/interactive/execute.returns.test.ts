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

describe("code can execute return on primitives", () => {
  it("no params/values returns string without quotes", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return "This thing"`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("This thing");
  });
  it("no params/values returns number (int)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 15`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("15");
  });
  it("no params/values returns number (float)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 15.25`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("15.25");
  });
  it("no params/values returns bool (true)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return true`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("true");
  });
  it("no params/values returns bool (false)", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return false`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("false");
  });
});

describe("code can execute return on expressions", () => {
  it("addition expression", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 15 + 23`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("38");
  });
  it("multiply expression", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 4 * 5`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("20");
  });
  it("subtract expression", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 4 - 2`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
  it("divide expression", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 4 / 2`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("2");
  });
});

describe("code can execute return with alias", () => {
  it("no params/values returns string as prim", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return "This thing" as item`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("item");
    expect(modified[0].value).toBe("This thing");
  });
  it("no params/values returns number (int) as prim", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 15 as item`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("item");
    expect(modified[0].value).toBe("15");
  });
  it("no params/values returns number (float) as prim", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return 15.25 as item`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("item");
    expect(modified[0].value).toBe("15.25");
  });
  it("no params/values returns bool (true) as prim", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return true as item`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("item");
    expect(modified[0].value).toBe("true");
  });
  it("no params/values returns bool (false) as prim", () => {
    const paramDefs: ParamDef[] = [];
    const values: string[] = [];
    const code = [`return false as item`];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("item");
    expect(modified[0].value).toBe("false");
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
  it("string and number return first", () => {
    const paramDefs: ParamDef[] = [
      { name: "Lorem", type: "string" },
      { name: "Lorem2", type: "number" },
    ];
    const values: string[] = ["lorem value", "15.225"];
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
    const values: string[] = ["lorem value", "15.225"];
    const code = ["return Lorem2"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("Lorem2");
    expect(modified[0].value).toBe("15.225");
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
  it("retun function", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["retun not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find keyword retun.",
    );
  });
  it("retun function with some extra spaces", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["  retun        not Found"];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Cannot find keyword retun.",
    );
  });
});
