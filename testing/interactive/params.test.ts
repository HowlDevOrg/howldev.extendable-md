import { describe, it, expect } from "vitest";
import { ParamDefSplitter } from "../../lib/logic/Interactive/ParamDef";
import { EnumType } from "../../lib/logic/Interactive/types";

describe("params are correctly rendered", () => {
  it("single string input works", () => {
    const value = ["start: string"];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(1);
    expect(modified[0].name).toBe("start");
    expect(modified[0].type).toBe("string");
  });
  it("single number input works", () => {
    const value = ["start: number"];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(1);
    expect(modified[0].name).toBe("start");
    expect(modified[0].type).toBe("number");
  });
  it("single boolean input works", () => {
    const value = ["start: boolean"];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(1);
    expect(modified[0].name).toBe("start");
    expect(modified[0].type).toBe("boolean");
  });
});

describe("can read enums correctly", () => {
  it("can do a simple 3 part enum", () => {
    const value = ["start: one | two | three"];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(1);
    expect(modified[0].name).toBe("start");
    expect(modified[0].type).toBe("enum");
    expect((modified[0] as EnumType).values).toEqual(["one", "two", "three"]);
  });
  it("can do a 5 part enum", () => {
    const value = [
      "interval: Seconds | Milliseconds | Microseconds | Nanoseconds | Picoseconds",
    ];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(1);
    expect(modified[0].name).toBe("interval");
    expect(modified[0].type).toBe("enum");
    expect((modified[0] as EnumType).values).toEqual([
      "Seconds",
      "Milliseconds",
      "Microseconds",
      "Nanoseconds",
      "Picoseconds",
    ]);
  });
});

describe("can read multiple params", () => {
  it("can read all four params", () => {
    const value = ["start: string", "num: number", "checked: boolean", "labels: One | Two | Three"];
    const modified = ParamDefSplitter(value);
    expect(modified.length).toBe(4);
    expect(modified[0].name).toBe("start");
    expect(modified[0].type).toBe("string");
    expect(modified[1].name).toBe("num");
    expect(modified[1].type).toBe("number");
    expect(modified[2].name).toBe("checked");
    expect(modified[2].type).toBe("boolean");
    expect(modified[3].name).toBe("labels");
    expect(modified[3].type).toBe("enum");
    expect((modified[3] as EnumType).values).toEqual(["One", "Two", "Three"]);
  });
});

describe("can read throw errors", () => {
  it("throws on unexpected capitals", () => {
    const value = ["start: String"];
    expect(() => ParamDefSplitter(value)).toThrowError("Can't determine type or create enum from type name String.");
  });
  it("throws on garbage", () => {
    const value = ["start: lskjdo"];
    expect(() => ParamDefSplitter(value)).toThrowError("Can't determine type or create enum from type name lskjdo.");
  });
});
