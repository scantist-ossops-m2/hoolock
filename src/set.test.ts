import set from "./set";

describe("set", () => {
  it("sets a property", () => {
    expect(set({ a: 1 }, "a", 2)).toEqual({ a: 2 });
  });
  it("sets an array index", () => {
    set({ a: [1, 2, 3] }, "a[1]", 4);
  });
  it("sets a nested property", () => {
    expect(set({ a: { b: 2 } }, "a.b", 3)).toEqual({ a: { b: 3 } });
  });
  it("sets a nested array property", () => {
    expect(set({ a: { b: [1, 2, 3] } }, "a.b[1]", 4)).toEqual({
      a: { b: [1, 4, 3] },
    });
  });
  it("sets array property at non-existant index", () => {
    expect(set([1, 2, 3], "6", 4)).toEqual([1, 2, 3, , , , 4]);
  });
  it("creates non-existant parent objects", () => {
    expect(set({}, "a.b.c", 1)).toEqual({ a: { b: { c: 1 } } });
  });
  it("creates non-existant parents with custom create function", () => {
    class Parent {
      [key: string]: any;
      constructor() {}
    }

    const result = set({}, "a.b.c", 1, () => new Parent()) as any;
    expect(result.a).toBeInstanceOf(Parent);
    expect(result.a.b).toBeInstanceOf(Parent);
    expect(result.a.b.c).toBe(1);
  });

  it("prevents prototype pollution", () => {
    expect(() => set({}, "__proto__.polluted", true)).toThrow(
      new TypeError(
        'Property "__proto__" does not belong to target object and cannot be accessed.'
      )
    );

    expect(() =>
      set(
        {
          a: {},
        },
        "a.__proto__.polluted",
        true
      )
    ).toThrow(
      new TypeError(
        'Property "__proto__" does not belong to target object and cannot be accessed.'
      )
    );

    expect(() => set({}, "constructor.prototype", true)).toThrow(
      new TypeError(
        'Property "constructor" does not belong to target object and cannot be accessed.'
      )
    );

    expect(
      // @ts-expect-error
      {}.polluted
    ).toBeUndefined();
  });
});
