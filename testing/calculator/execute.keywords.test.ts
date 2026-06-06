import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/Helpers/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can handle odd caps of keywords", () => {
  const paramDefs: ParamDef[] = [];
  const values: string[] = [];
  it("Return", () => {
    const code = ["Return 15"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("15");
  });
  it("AssiGN", () => {
    const code = ["AssiGN x = 15", "retURn x"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("x");
    expect(modified[0].value).toBe("15");
  });
});
