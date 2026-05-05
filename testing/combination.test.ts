import { describe, it, expect } from "vitest";
import {combine} from '../lib/stringfunc';

describe("code blocks combine", () => {
  it("broken code block comes back together", () => {
    const start = ["```math", "```"];
    const end = combine(start);
    expect(end.length).toBe(1);
    expect(end).toStrictEqual(["```math\n\n```"]);
  });

  it("starting code block does nothing", () => {
    const start = ["```"];
    const end = combine(start);
    expect(end.length).toBe(1);
    expect(end).toStrictEqual(["```"]);
  });
});
