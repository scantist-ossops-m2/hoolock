import isPlainObject from "./isPlainObject";

describe("isPlainObject", () => {
  it("should return true if the object is an object literal", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
  });

  it("should return false if the object is not an object literal", () => {
    for (const value of [
      null,
      undefined,
      () => {},
      Object.assign(() => {}, { a: 1 }),
      "a",
      new Set(),
      new (class {
        a = 1;
      })(),
      new (class extends Object {
        a = 1;
      })(),
    ]) {
      expect(isPlainObject(value)).toBe(false);
    }
  });
});
