import { describe, it, expect } from "vitest";
import { greet } from "../lib/greet";

describe("greet", () => {
  it("returns a greeting with the given name", () => {
    expect(greet("world")).toBe("Hello, world!");
  });
});
