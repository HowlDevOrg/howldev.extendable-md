import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Interactive/ExecuteCode";
import { ParamDef } from "../../lib/logic/Interactive/types";
import { beforeEach } from "vitest";

describe("code can execute math operators on other side of assign", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 + 3", () => {
    const code = ["assign x = 2 + 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("5");
  });
  it("can execute 2 * 3", () => {
    const code = ["assign x = 2 * 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("6");
  });
  it("can execute 2 - 3", () => {
    const code = ["assign x = 2 - 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("-1");
  });
  it("can execute 2 / 3", () => {
    const code = ["assign x = 2 / 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("0.6666666666666666");
  });
  it("can execute 5 % 3", () => {
    const code = ["assign x = 5 % 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("2");
  });
});

describe("code can execute string concatenate on other side of assign", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute one + two", () => {
    const code = [`assign x = "one" + "two"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("onetwo");
  });
  it("can execute one + two with spaces", () => {
    const code = [`assign x = "one " + "two"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("one two");
  });
});

describe("code can execute equivalence operators on other side of assign (for numbers)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 < 3", () => {
    const code = ["assign x = 2 < 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 3 < 2", () => {
    const code = ["assign x = 3 < 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute 2 > 3", () => {
    const code = ["assign x = 2 > 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute 2 <= 3", () => {
    const code = ["assign x = 2 <= 3", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 2 <= 2", () => {
    const code = ["assign x = 2 <= 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 2 >= 2", () => {
    const code = ["assign x = 2 >= 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 2 >= 5", () => {
    const code = ["assign x = 2 >= 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute 5 >= 2", () => {
    const code = ["assign x = 5 >= 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 5 == 2", () => {
    const code = ["assign x = 5 == 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute 5 != 2", () => {
    const code = ["assign x = 5 != 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
});

describe("equivalence operators on all types", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 == 2", () => {
    const code = ["assign x = 2 == 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute 2 != 2", () => {
    const code = ["assign x = 2 != 2", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it(`can execute "this" == "this"`, () => {
    const code = [`assign x = "this" == "this"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it(`can execute "this" != "that"`, () => {
    const code = [`assign x = "this" != "that"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it(`can execute "this" == "that"`, () => {
    const code = [`assign x = "this" == "that"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute true != false", () => {
    const code = ["assign x = true != false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute true == false", () => {
    const code = ["assign x = true == false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
});

// Executed left to right
describe("code can execute multiple math operators on other side of assign", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 + 3 * 5", () => {
    const code = ["assign x = 2 + 3 * 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("25");
  });
  it("can execute 2 * 3 + 5", () => {
    const code = ["assign x = 2 * 3 + 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("11");
  });
});

describe("code can alias generic functions on return", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute 2 + 3 as result", () => {
    const code = ["return 2 + 3 as result"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("result");
    expect(modified[0].value).toBe("5");
  });
  it("can execute 2 + 3 * 5 as result", () => {
    const code = ["return 2 + 3 * 5 as result"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("result");
    expect(modified[0].value).toBe("25");
  });
});

describe("code throws errors on mismatched types", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("number and string", () => {
    const code = [`return 15 < "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator < on types number and string.",
    );
  });
  it("number and bool", () => {
    const code = [`return 15 + true`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator + on types number and bool.",
    );
  });
  it("string and bool", () => {
    const code = [`return "hello" == true`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator == on types string and bool.",
    );
  });
  it("bool and string", () => {
    const code = [`return true < "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Can't execute operator < on types bool and string.",
    );
  });
});

describe("code throws errors for numeric operators when not number (string)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("- operator", () => {
    const code = [`return "13" - "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator -.",
    );
  });
  it("* operator", () => {
    const code = [`return "13" * "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator *.",
    );
  });
  it("/ operator", () => {
    const code = [`return "13" / "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator /.",
    );
  });
  it("% operator", () => {
    const code = [`return "13" % "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator %.",
    );
  });
  it("< operator", () => {
    const code = [`return "13" < "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator <.",
    );
  });
  it("> operator", () => {
    const code = [`return "13" > "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator >.",
    );
  });
  it("<= operator", () => {
    const code = [`return "13" <= "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator <=.",
    );
  });
  it(">= operator", () => {
    const code = [`return "13" >= "hello"`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type string is not valid for operator >=.",
    );
  });
});

describe("code throws errors for numeric operators when not number (boolean)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("- operator", () => {
    const code = [`return true - false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator -.",
    );
  });
  it("* operator", () => {
    const code = [`return true * false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator *.",
    );
  });
  it("/ operator", () => {
    const code = [`return true / false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator /.",
    );
  });
  it("% operator", () => {
    const code = [`return true % false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator %.",
    );
  });
  it("< operator", () => {
    const code = [`return true < false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator <.",
    );
  });
  it("> operator", () => {
    const code = [`return true > false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator >.",
    );
  });
  it("<= operator", () => {
    const code = [`return true <= false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator <=.",
    );
  });
  it(">= operator", () => {
    const code = [`return true >= false`];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "Type bool is not valid for operator >=.",
    );
  });
});
