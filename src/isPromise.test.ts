import isPromise from "./isPromise";

describe("isPromise", () => {
  it("should return true if the object is a Promise", () => {
    const promise = Promise.resolve();
    expect(isPromise(promise)).toBe(true);
  });

  it("should return false if the object is not a Promise", () => {
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise("hello")).toBe(false);
  });
});
