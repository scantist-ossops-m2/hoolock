import isArray from "./isArray";

describe("isArray", () => {
  it("should return true if the object is an array", () => {
    expect(isArray([])).toBe(true);
    expect(isArray([1, 2, 3])).toBe(true);
  });

  it("should return false if the object is not an array", () => {
    expect(isArray({})).toBe(false);
    expect(isArray("hello")).toBe(false);
    expect(isArray(123)).toBe(false);
  });
});
