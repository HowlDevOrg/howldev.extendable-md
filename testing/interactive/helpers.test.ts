import { describe, it, expect } from "vitest";
import {
  parseIfElseStatements,
  splitOnOutermostCommas,
} from "../../lib/logic/Calculator/Helpers/stringHelpers";

describe("can split return params", () => {
  const tests = [
    { value: "lorem, lorem2", count: 2, lengths: [5, 6] },
    { value: "pow(3, 2)", count: 1, lengths: [9] },
    { value: "pow(3, 2) as this", count: 1, lengths: [17] },
    { value: "pow(3, 2) as this, atan2(100, 50)", count: 2, lengths: [17, 14] },
    {
      value: "15 * 2 + 5 as this, atan2(100, 50)",
      count: 2,
      lengths: [18, 14],
    },
  ];
  tests.forEach((test) => {
    it(`split ${test.value}`, () => {
      const modified = splitOnOutermostCommas(test.value);
      expect(modified.length).toBe(test.count);
      for (const i in test.lengths) {
        expect(modified[i].length).toBe(test.lengths[i]);
      }
    });
  });
});

describe("can split if/elsif/else statements", () => {
  const tests = [
    {
      label: "length 2 with returns",
      code: ["if 5 < 3", "return 5", "else", "return 3"],
      results: [
        ["if 5 < 3", "return 5"],
        ["else", "return 3"],
      ],
    },
    {
      label: "length 2 with assignment",
      code: ["if 5 < 3", "assign x = 5", "else", "assign x = 3"],
      results: [
        ["if 5 < 3", "assign x = 5"],
        ["else", "assign x = 3"],
      ],
    },
    {
      label: "length 1, 2 with assignment",
      code: ["if 5 < 3", "else", "assign x = 3"],
      results: [["if 5 < 3"], ["else", "assign x = 3"]],
    },
    {
      label: "length 2, 1 with assignment",
      code: ["if 5 < 3", "assign x = 5", "else"],
      results: [["if 5 < 3", "assign x = 5"], ["else"]],
    },
    {
      label: "length 3, 3 with assignment",
      code: [
        "if 3 < 15",
        "assign x = -2",
        "assign y = 32.6",
        "else",
        "assign x = 15",
        "assign y = 32.6",
      ],
      results: [
        ["if 3 < 15", "assign x = -2", "assign y = 32.6"],
        ["else", "assign x = 15", "assign y = 32.6"],
      ],
    },
    {
      label: "length 3, 2, 1 with assignment",
      code: [
        "if 3 < 15",
        "assign x = -2",
        "assign y = 32.6",
        "elsif 5 > 3",
        "assign x = 15",
        "assign y = 32.6",
        "else",
      ],
      results: [
        ["if 3 < 15", "assign x = -2", "assign y = 32.6"],
        ["elsif 5 > 3", "assign x = 15", "assign y = 32.6"],
        ["else"],
      ],
    },
    {
      label: "length 3, 2, 1 with assignment works with crazy capitals and spaces before",
      code: [
        " if 3 < 15",
        "assign x = -2",
        "assign y = 32.6",
        "    eLsIf 5 > 3",
        "assign x = 15",
        "assign y = 32.6",
        "  elSe",
      ],
      results: [
        [" if 3 < 15", "assign x = -2", "assign y = 32.6"],
        ["    eLsIf 5 > 3", "assign x = 15", "assign y = 32.6"],
        ["  elSe"],
      ],
    },
  ];
  tests.forEach((test) => {
    it(`split for ${test.label}`, () => {
      const modified = parseIfElseStatements(test.code, "if", ["else", "elsif"]);
      expect(modified.length).toBe(test.results.length);
      for (const i in test.results) {
        expect(modified[i]).toStrictEqual(test.results[i]);
      }
    });
  });
});

describe("internal error for not starting with if", () => {
  it("starts with assign", () => {
    const code = ["assign 5", "else", "assign x = 3"];
    expect(() => parseIfElseStatements(code, "if", ["else", "elsif"])).toThrowError(
      "Internal Error: If statement does not start with a(n) if statement. Instead started with: assign 5.",
    );
  });
  it("doesn't throw error for capital IF", () => {
    const code = ["IF 5 < 3", "assign x = 5", "else", "assign x = 3"];
    const result = parseIfElseStatements(code, "if", ["else", "elsif"]);
    expect(result.length).toBe(2);
  });
  it("endif is included", () => {
    const code = ["if 3 < 15", "assign 5", "else", "assign x = 3", "endif"];
    expect(() => parseIfElseStatements(code, "if", ["else", "elsif"])).toThrowError(
      "Internal Error: Parser code should not have endif included.",
    );
  });
});
