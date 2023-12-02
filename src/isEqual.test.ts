import isEqual from "./isEqual";

describe("isEqual", () => {
  test("returns true for deeply equal objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 2 } };
    expect(isEqual(obj1, obj2)).toBe(true);
    const obj3 = [
      { a: 1, b: { c: 2 } },
      { d: 3 },
      [
        {
          e: [3],
        },
      ],
    ];
    const obj4 = [
      { a: 1, b: { c: 2 } },
      { d: 3 },
      [
        {
          e: [3],
        },
      ],
    ];
    expect(isEqual(obj3, obj4)).toBe(true);
  });

  test("returns false for non-deeply equal objects", () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = { a: 1, b: { c: 3 } };
    expect(isEqual(obj1, obj2)).toBe(false);
    const obj3 = [{ a: 1, b: { c: 2 } }, { d: 3 }];
    const obj4 = [{ a: 1, b: { c: 2 } }, { d: 4 }];
    expect(isEqual(obj3, obj4)).toBe(false);
  });

  test("handles circular references", () => {
    const obj1 = { a: 1, b: { c: 2 } } as any;
    obj1.b.d = obj1;
    const obj2 = { a: 1, b: { c: 2 } } as any;
    obj2.b.d = obj2;
    expect(isEqual(obj1, obj2)).toBe(true);
  });
});
