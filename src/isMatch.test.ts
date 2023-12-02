import isMatch from "./isMatch";

describe("isMatch", () => {
  test("returns true for equal values", () => {
    expect(isMatch(5, 5)).toBe(true);
    expect(isMatch("hello", "hello")).toBe(true);
    expect(isMatch(null, null)).toBe(true);
    expect(isMatch(undefined, undefined)).toBe(true);
    expect(isMatch({}, {})).toBe(true);
    expect(isMatch([], [])).toBe(true);
    expect(isMatch([1, 2, 3], [1, 2, 3])).toBe(true);
    const nums = [1, 2, 3];
    expect(isMatch([nums], [nums])).toBe(true);
    const b = { c: 2 };
    const obj1 = { a: 1, b };
    const obj2 = { a: 1, b };
    expect(isMatch(obj1, obj2)).toBe(true);
  });

  test("returns false for non-equal values", () => {
    expect(isMatch(5, "5")).toBe(false);
    expect(isMatch(null, undefined)).toBe(false);
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };
    expect(isMatch(obj1, obj2)).toBe(false);
  });
});
