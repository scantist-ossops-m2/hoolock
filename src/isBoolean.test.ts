import isBoolean from "./isBoolean";

describe("isBoolean", () => {
  it("should return true if the object is a boolean", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it("should return false if the object is not a boolean", () => {
    expect(isBoolean({})).toBe(false);
    expect(isBoolean([])).toBe(false);
    expect(isBoolean("hello")).toBe(false);
  });
});
