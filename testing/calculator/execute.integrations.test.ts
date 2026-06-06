import { describe, it, expect } from "vitest";
import { ExecuteCode } from "../../lib/logic/Calculator/Helpers/ExecuteCode";
import { ParamDef } from "../../lib/logic/Calculator/types";


describe("full code runs with minor errors that are now fixed", () => {
  it("problems with JS number semantics", () => {
    const paramDefs: ParamDef[] = [{name: "angle", type: "number"}, {name: "radius", type: "number"}];
    const values: string[] = ["90", "2"];
    const code = ["return cos(degtorad(angle)) * radius"];
    const modified = ExecuteCode(paramDefs, values, code);
    expect(modified.length).toBe(1);
    expect(modified[0].label).toBe("");
    expect(modified[0].value).toBe("1.2246467991473532e-16");
  });
});
