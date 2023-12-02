import isDefined from "./isDefined";

describe("isDefined", () => {
  it("should return true if the value is defined", () => {
    expect(isDefined(123)).toBe(true);
    expect(isDefined("hello")).toBe(true);
  });

  it("should return false if the value is undefined", () => {
    let x;
    expect(isDefined(x)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });
});
