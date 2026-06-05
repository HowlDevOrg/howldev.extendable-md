import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can execute math operators on other side of assign", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const mathOperations = [
    { op: "+", left: 2, right: 3, expected: "5" },
    { op: "*", left: 2, right: 3, expected: "6" },
    { op: "-", left: 2, right: 3, expected: "-1" },
    { op: "/", left: 2, right: 3, expected: "0.6666666666666666" },
    { op: "%", left: 5, right: 3, expected: "2" },
  ];
  mathOperations.forEach(({ op, left, right, expected }) => {
    it(`can execute ${left} ${op} ${right}`, () => {
      const code = [`assign x = ${left} ${op} ${right}`, "return x"];
      const modified = ExecuteCode(paramDefs, values, code);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("x");
      expect(modified[0].value).toBe(expected);
    });
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
  it("can execute str with spaces", () => {
    const code = [`assign x = "here " + str(abs(-20)) + " that"`, "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("here 20 that");
  });
});

describe("code can run self assignment", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("new variable can be self assigned", () => {
    const code = [`assign x = 5 + 3`, "assign x = x + 3",  "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("11");
  });
});

describe("code can execute equivalence operators on other side of assign (for numbers)", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  const equivalenceTests = [
    { left: 2, op: "<", right: 3, expected: "true" },
    { left: 3, op: "<", right: 2, expected: "false" },
    { left: 2, op: ">", right: 3, expected: "false" },
    { left: 2, op: "<=", right: 3, expected: "true" },
    { left: 2, op: "<=", right: 2, expected: "true" },
    { left: 2, op: ">=", right: 2, expected: "true" },
    { left: 2, op: ">=", right: 5, expected: "false" },
    { left: 5, op: ">=", right: 2, expected: "true" },
    { left: 5, op: "==", right: 2, expected: "false" },
    { left: 5, op: "!=", right: 2, expected: "true" },
  ];
  equivalenceTests.forEach(({ left, op, right, expected }) => {
    it(`can execute ${left} ${op} ${right}`, () => {
      const code = [`assign x = ${left} ${op} ${right}`, "return x"];
      const modified = ExecuteCode(paramDefs, values, code);
      expect(modified.length).toBe(1);
      expect(modified[0].label).toBe("x");
      expect(modified[0].value).toBe(expected);
    });
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

describe("boolean operators", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("can execute true && false", () => {
    const code = ["assign x = true && false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute true || false", () => {
    const code = ["assign x = true || false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute false && false", () => {
    const code = ["assign x = false && false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute false || false", () => {
    const code = ["assign x = false || false", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("false");
  });
  it("can execute true && true", () => {
    const code = ["assign x = true && true", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
  });
  it("can execute true || true", () => {
    const code = ["assign x = true || true", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("true");
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
    expect(modified[0].value).toBe("17");
  });
  it("can execute 2 * 3 + 5", () => {
    const code = ["assign x = 2 * 3 + 5", "return x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("11");
  });
});
