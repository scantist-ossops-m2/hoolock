import isMap from "./isMap";

describe("isMap", () => {
  it("should return true if the object is a Map", () => {
    const map = new Map();
    expect(isMap(map)).toBe(true);
  });

  it("should return false if the object is not a Map", () => {
    expect(isMap({})).toBe(false);
    expect(isMap([])).toBe(false);
    expect(isMap("hello")).toBe(false);
  });
});
