import { describe, it, expect } from "vitest";
import { evaluateExpression } from "../../lib/logic/Calculator/Helpers/evaluateExpression";

describe("code can run minified text (basically)", () => {
  it("Can run multiple math operators", () => {
    const modified = evaluateExpression("4+2*5", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("number");
    expect(modified.value).toBe(30);
  });
  it("Can run close functions", () => {
    const modified = evaluateExpression("abs(pow(-2,5))", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("number");
    expect(modified.value).toBe(32);
  });
  it("Can run close functions with operators", () => {
    const modified = evaluateExpression("abs(pow(5-3,2+3))", {});
    expect(modified.label).toBe("");
    expect(modified.type).toBe("number");
    expect(modified.value).toBe(32);
  });
});