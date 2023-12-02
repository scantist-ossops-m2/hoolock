import isObject from "./isObject";

describe("isObject", () => {
  it("should return true if the object is an object", () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ a: 1, b: 2 })).toBe(true);
  });

  it("should return false if the object is not an object", () => {
    expect(isObject(null)).toBe(false);
    expect(isObject("hello")).toBe(false);
    expect(isObject(123)).toBe(false);
  });
});
