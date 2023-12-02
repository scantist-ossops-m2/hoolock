import isString from "./isString";

describe("isString", () => {
  it("should return true if the object is a string", () => {
    expect(isString("hello")).toBe(true);
    expect(isString(new String("hello"))).toBe(true);
  });

  it("should return false if the object is not a string", () => {
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(123)).toBe(false);
  });
});
