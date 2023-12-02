import isNumber from "./isNumber";

describe("isNumber", () => {
  it("should return true if the object is a number", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(3.14)).toBe(true);
  });

  it("should return false if the object is not a number", () => {
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber("hello")).toBe(false);
  });
});
