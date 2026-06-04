import { describe, it, expect } from "vitest";
import { splitOnOutermostCommas } from "../../lib/logic/Calculator/Helpers/stringHelpers";

describe("can split return params", () => {
  const tests = [
    { value: "lorem, lorem2", count: 2, lengths: [5, 6] },
    { value: "pow(3, 2)", count: 1, lengths: [9] },
    { value: "pow(3, 2) as this", count: 1, lengths: [17] },
    { value: "pow(3, 2) as this, atan2(100, 50)", count: 2, lengths: [17, 14] },
    { value: "15 * 2 + 5 as this, atan2(100, 50)", count: 2, lengths: [18, 14] },
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
