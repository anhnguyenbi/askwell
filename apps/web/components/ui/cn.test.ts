import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins strings", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("skips falsy values but keeps 0", () => {
    expect(cn("a", false, null, undefined, "", 0, "b")).toBe("a 0 b");
  });

  it("trims and drops whitespace-only strings", () => {
    expect(cn("  a  ", "   ", "b")).toBe("a b");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", false, ["c"]]], "d")).toBe("a b c d");
  });

  it("includes object keys whose value is truthy", () => {
    expect(cn({ a: true, b: false, c: null, d: undefined, e: true })).toBe("a e");
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});
