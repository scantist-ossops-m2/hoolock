import merge from "./merge";

describe("merge", () => {
  it("performs a deep merge", () => {
    const target = { a: { x: 1 } };
    const source = { a: { y: 2 }, b: { z: 3 } };
    const merged = merge(target, source);
    expect(target === merged).toBe(false);
    expect(target.a === merged.a).toBe(false);
    expect(merged).toEqual({ a: { x: 1, y: 2 }, b: { z: 3 } });
  });

  test("never mutates", () => {
    const func = () => {};
    const a = merge({ func }, { func: { a: 1 } });
    // @ts-ignore
    expect(func.a).not.toBe(1);
    expect(a.func).toStrictEqual({ a: 1 });

    const b = merge({ func: { a: 1 } }, { func });
    expect(b.func === func).toBe(true);
    // @ts-ignore
    expect(func.a).not.toBe(1);

    const obj = { a: 1 };
    const c = merge({ obj }, { obj: { b: 2 } });
    expect(c.obj).toStrictEqual({ a: 1, b: 2 });
    // @ts-ignore
    expect(obj.b).toBeUndefined();

    const d = merge({ obj: { b: 2 } }, { obj });
    expect(d.obj).toEqual({
      a: 1,
      b: 2,
    });
    // @ts-ignore
    expect(obj.a).toBe(1);

    const arr = [1, 2, 3];

    const e = merge({ arr }, { arr: [4, 5, 6] });
    expect(e.arr).toEqual([1, 2, 3, 4, 5, 6]);
    expect(arr).toEqual([1, 2, 3]);

    const f = merge({ arr: [4, 5, 6] }, { arr });
    expect(f.arr).toEqual([4, 5, 6, 1, 2, 3]);
    expect(arr).toEqual([1, 2, 3]);
  });

  it("performs a deep merge with arrays", () => {
    const target = { a: [0, 1, 2] };
    const source = { a: [3, 4, 5] };

    const merged = merge(target, source);

    expect(target === merged).toBe(false);
    expect(target.a === merged.a).toBe(false);
    expect(merged).toEqual({ a: [0, 1, 2, 3, 4, 5] });
  });

  it("prioritizes differing types", () => {
    const target = { a: { x: 1 } };
    const source = [3, 4, 5];
    expect(merge(target, source)).toEqual(source);
  });

  it("handles circular references", () => {
    const a: any = { foo: "bar" };
    a.b = a;
    const b: any = { foo: "baz" };
    b.a = a;
    const c: any = { foo: "qux" };
    c.c = b;

    const merged = merge(a, b, c, {
      a: {
        bar: "baz",
      },
      c: {
        a: {
          qux: "foo",
        },
      },
    });

    expect(merged.foo).toBe("qux");
    expect(merged.a === merged).toBe(true);
    expect(merged.a.foo).toBe("qux");
    expect(merged.b === merged).toBe(true);
    expect(merged.b.foo).toBe("qux");
    expect(merged.c.a).toBe(merged);
    expect(merged.c.a.foo).toBe("qux");

    // Now for the nested merged circular references.
    for (const obj of [merged, merged.b, merged.c.a]) {
      expect(obj.bar).toBe("baz");
      expect(obj.qux).toBe("foo");
    }
  });

  it("clones but keeps circular references in-tact", () => {
    const a: any = { foo: "bar" };
    a.b = a;
    const b: any = { bar: "baz" };
    b.c = a;
    b.d = b;
    b.e = b;
    const merged = merge(a, b);

    // Check to make sure the circular reference is in-tact.
    expect(merged.foo).toBe("bar");
    expect(merged.bar).toBe("baz");
    expect(merged.b === merged).toBe(true);
    expect(merged.b.foo).toBe("bar");
    expect(merged.b.bar).toBe("baz");
    expect(merged.c === merged).toBe(true);
    expect(merged.c.foo).toBe("bar");
    expect(merged.c.bar).toBe("baz");
    expect(merged.d === merged.e).toBe(true);
    expect(merged.d.bar).toBe("baz");
    expect(merged.d.foo).not.toBeDefined();

    // Check to make sure original objects are not mutated.
    expect(a.b === a).toBe(true);
    expect(a.b === merged).toBe(false);
    expect(b.c === a).toBe(true);
    expect(b.c === merged).toBe(false);
    expect(b.d === b).toBe(true);
    expect(b.d === merged).toBe(false);
    expect(b.e === b).toBe(true);
    expect(b.e === merged).toBe(false);
    expect(a.b.bar).not.toBeDefined();
  });
});
