import isNull from "./isNull";

describe("isNull", () => {
  it("should return true if the object is null", () => {
    expect(isNull(null)).toBe(true);
  });

  it("should return false if the object is not null", () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull("hello")).toBe(false);
  });
});
