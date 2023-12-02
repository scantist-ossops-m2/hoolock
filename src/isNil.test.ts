import isNil from "./isNil";

describe("isNil", () => {
  it("should return true if the object is null, undefined, or void", () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    let x;
    expect(isNil(x)).toBe(true);
  });

  it("should return false if the object is not null, undefined, or void", () => {
    expect(isNil({})).toBe(false);
    expect(isNil("hello")).toBe(false);
    expect(isNil(123)).toBe(false);
  });
});
