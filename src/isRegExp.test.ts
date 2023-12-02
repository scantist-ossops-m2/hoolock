import isRegExp from "./isRegExp";

describe("isRegExp", () => {
  it("should return true if the object is a RegExp", () => {
    expect(isRegExp(/regex/)).toBe(true);
    expect(isRegExp(new RegExp("regex"))).toBe(true);
  });

  it("should return false if the object is not a RegExp", () => {
    expect(isRegExp({})).toBe(false);
    expect(isRegExp([])).toBe(false);
    expect(isRegExp("hello")).toBe(false);
  });
});
