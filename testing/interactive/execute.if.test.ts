// import { describe, it, expect } from "vitest";
// import { ExecuteCode } from "../../lib/logic/Calculator/ExecuteCode";
// import { ParamDef } from "../../lib/logic/Calculator/types";

// describe("code can run if statements", () => {
//   it("if with number check and inner return (true)", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = ["if 15 > 5", "return true", "else", "return false", "endif"];
//     const modified = ExecuteCode(paramDefs, values, code);
//     expect(modified.length).toBe(1);
//     expect(modified[0].label).toBe("");
//     expect(modified[0].value).toBe("true");
//   });
//   it("if with number check and inner return (false)", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = ["if 15 < 5", "return true", "else", "return false", "endif"];
//     const modified = ExecuteCode(paramDefs, values, code);
//     expect(modified.length).toBe(1);
//     expect(modified[0].label).toBe("");
//     expect(modified[0].value).toBe("false");
//   });
//   it("if with assignments and global return (true)", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = [
//       "if 15 > 5",
//       "assign x = 15",
//       "else",
//       "assign x = 3",
//       "endif",
//       "return x",
//     ];
//     const modified = ExecuteCode(paramDefs, values, code);
//     expect(modified.length).toBe(1);
//     expect(modified[0].label).toBe("x");
//     expect(modified[0].value).toBe("15");
//   });
//   it("if with assignments and global return (true)", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = [
//       "if 15 < 5",
//       "assign x = 15",
//       "else",
//       "assign x = 3",
//       "endif",
//       "return x",
//     ];
//     const modified = ExecuteCode(paramDefs, values, code);
//     expect(modified.length).toBe(1);
//     expect(modified[0].label).toBe("x");
//     expect(modified[0].value).toBe("3");
//   });
// });

// describe("code can throws errors in if if not booleans", () => {
//   it("if is number", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = ["if 15", "else", "endif", "return 1"];
//     expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
//       "Cannot interpret type number as a boolean in an if statement.",
//     );
//   });
//   it("if is number as parameter", () => {
//     const paramDefs: ParamDef[] = [{ name: "lorem", type: "number" }];
//     const values: string[] = ["15"];
//     const code = ["if lorem", "else", "endif", "return 1"];
//     expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
//       "Cannot interpret type number as a boolean in an if statement.",
//     );
//   });
//   it("if is string", () => {
//     const paramDefs: ParamDef[] = [];
//     const values: string[] = [];
//     const code = ['if "this"', "else", "endif", "return 1"];
//     expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
//       "Cannot interpret type string as a boolean in an if statement.",
//     );
//   });
//   it("if is string as parameter", () => {
//     const paramDefs: ParamDef[] = [{ name: "lorem", type: "string" }];
//     const values: string[] = ["this"];
//     const code = ["if lorem", "else", "endif", "return 1"];
//     expect(() => ExecuteCode(paramDefs, values, code)).toThrowError(
//       "Cannot interpret type string as a boolean in an if statement.",
//     );
//   });
// });
