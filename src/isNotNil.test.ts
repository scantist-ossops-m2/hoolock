import isNotNil from "./isNotNil";

describe("isNotNil", () => {
  it("should return true if the value is not null, undefined, or void", () => {
    expect(isNotNil(123)).toBe(true);
    expect(isNotNil("hello")).toBe(true);
    expect(isNotNil({})).toBe(true);
  });

  it("should return false if the value is null, undefined, or void", () => {
    expect(isNotNil(null)).toBe(false);
    expect(isNotNil(undefined)).toBe(false);
    let x;
    expect(isNotNil(x)).toBe(false);
  });
});
