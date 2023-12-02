import isSymbol from "./isSymbol";

describe("isSymbol", () => {
  it("should return true if the object is a symbol", () => {
    expect(isSymbol(Symbol())).toBe(true);
  });

  it("should return false if the object is not a symbol", () => {
    expect(isSymbol({})).toBe(false);
    expect(isSymbol([])).toBe(false);
    expect(isSymbol("hello")).toBe(false);
  });
});
