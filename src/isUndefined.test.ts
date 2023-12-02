import isUndefined from "./isUndefined";

describe("isUndefined", () => {
  it("should return true if the object is undefined", () => {
    let x;
    expect(isUndefined(x)).toBe(true);
    expect(isUndefined(undefined)).toBe(true);
  });

  it("should return false if the object is not undefined", () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined("hello")).toBe(false);
  });
});
