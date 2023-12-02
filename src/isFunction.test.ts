import isFunction from "./isFunction";

describe("isFunction", () => {
  it("should return true if the object is a function", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
    expect(isFunction(class {})).toBe(true);
  });

  it("should return true if the object can be called", () => {
    const mock = jest.fn();
    expect(isFunction(mock)).toBe(true);
  });

  it("should return false if the object is not a function", () => {
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
    expect(isFunction("hello")).toBe(false);
  });
});
