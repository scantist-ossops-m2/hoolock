import isSet from "./isSet";

describe("isSet", () => {
  it("should return true if the object is a Set", () => {
    const set = new Set();
    expect(isSet(set)).toBe(true);
  });

  it("should return false if the object is not a Set", () => {
    expect(isSet({})).toBe(false);
    expect(isSet([])).toBe(false);
    expect(isSet("hello")).toBe(false);
  });
});
