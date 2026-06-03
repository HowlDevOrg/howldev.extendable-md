import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";

describe("code can throw", () => {
  it("can throw with short string", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = ["throw This is what I expect."];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "User Error: This is what I expect.",
    );
  });
  it("can throw with longer string", () => {
    const paramDefs: ParamDef[] = [{ name: "Lorem", type: "string" }];
    const values: string[] = ["lorem value"];
    const code = [
      "throw Did not get a valid number. Please have it between 0 and 360.",
    ];
    expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
      "User Error: Did not get a valid number. Please have it between 0 and 360.",
    );
  });
});
