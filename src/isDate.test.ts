import isDate from "./isDate";

describe("isDate", () => {
  it("should return true if the object is a Date", () => {
    expect(isDate(new Date())).toBe(true);
  });

  it("should return false if the object is not a Date", () => {
    expect(isDate({})).toBe(false);
    expect(isDate([])).toBe(false);
    expect(isDate("hello")).toBe(false);
  });
});
