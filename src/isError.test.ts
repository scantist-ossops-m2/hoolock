import isError from "./isError";

describe("isError", () => {
  it("should return true if the object is an Error", () => {
    expect(isError(new Error())).toBe(true);
  });

  it("should return false if the object is not an Error", () => {
    expect(isError({})).toBe(false);
    expect(isError([])).toBe(false);
    expect(isError("hello")).toBe(false);
  });
});
