import { describe, it, expect } from "vitest";
import { semanticDiffuser } from "../lib/stringfunc";

describe("code display properly outputs", () => {
    it("mermaid blocks render correctly", () => {
      const value = "```mermaid\nflowchart LR\nlorem --> this\n```";
      const modified = semanticDiffuser(value);
      expect(modified.length).toBe(1);
      expect(modified[0]).toStrictEqual("```mermaid\nflowchart LR\nlorem --> this"); 
    });
  it("plain code block exports properly 1", () => {
    const value = "```code\nThis is the code\n```";
    const modified = semanticDiffuser(value);
    expect(modified.length).toBe(1);
    expect(modified[0]).toStrictEqual("```code\nThis is the code"); // Ending ``` are explicitly removed
  });
  it("plain code block exports properly 2", () => {
    const value = "```code\nThis is the code\n\n```";
    const modified = semanticDiffuser(value);
    expect(modified.length).toBe(1);
    expect(modified[0]).toStrictEqual("```code\nThis is the code\n"); 
  });
  it("code block with text before", () => {
    const value = "This is some text.\n```code\nThis is the code\n\n```";
    const modified = semanticDiffuser(value);
    expect(modified.length).toBe(2);
    expect(modified[0]).toStrictEqual("This is some text.");
    expect(modified[1]).toStrictEqual("```code\nThis is the code\n");
  });
  it("code block with text after", () => {
    const value = "```code\nThis is the code\n\n```\nThis is some text.";
    const modified = semanticDiffuser(value);
    expect(modified.length).toBe(2);
    expect(modified[0]).toStrictEqual("```code\nThis is the code\n");
    expect(modified[1]).toStrictEqual("This is some text.");
  });
});
