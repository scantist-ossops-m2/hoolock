import pruneDeep, { PruneDeepContext } from "./pruneDeep";

describe("pruneDeep", () => {
  const createPropertyGetter = (
    completeSource: Record<PropertyKey, any>,
    // Need the finished target because the 'target' properties in params
    // will have been mutated by the time mock.calls is accessed.
    finishedTarget: Record<PropertyKey, any>
  ) => {
    return (path: PropertyKey[]): PruneDeepContext => {
      const _path = [...path];
      const key = path.pop()!;
      const source = path.reduce((acc, key) => acc[key], completeSource),
        target = path.reduce((acc, key) => acc[key], finishedTarget);
      const value = source[key];
      return {
        key,
        path: _path,
        source,
        target,
        value,
      };
    };
  };

  it("calls the predicate for each property", () => {
    const predicate = jest.fn<boolean, [PruneDeepContext]>(() => true);
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    const result = pruneDeep(object, predicate);
    const property = createPropertyGetter(object, result);
    expect(predicate).toHaveBeenCalledTimes(5);
    expect(predicate).toHaveBeenCalledWith(property(["a"]));
    expect(predicate).toHaveBeenCalledWith(property(["b"]));
    expect(predicate).toHaveBeenCalledWith(property(["c"]));
    expect(predicate).toHaveBeenCalledWith(property(["d", "e"]));
    expect(predicate).toHaveBeenCalledWith(property(["d"]));
  });

  it("returns a deep copy of the object", () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    const result = pruneDeep(object, () => true);
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(result.d).not.toBe(object.d);
  });

  it('removes properties for which the predicate returns "false"', () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4, f: 5 } };
    const result = pruneDeep(object, () => false);
    expect(result).toEqual({});

    const result2 = pruneDeep(object, (property) => {
      if (property.value === 5) return false;
      if (property.value === 2) return false;
      return true;
    });
    expect(result2).toEqual({ a: 1, c: 3, d: { e: 4 } });
  });

  it("removes nested properties before their parents", () => {
    const arr = [1, 2, 3, [4, 5, 6]];
    const result = pruneDeep(arr, ({ value }) => {
      if (typeof value === "number") return value < 4;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    });
    expect(result).toEqual([1, 2, 3]);
  });

  interface Abc {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    xyz: Abc;
  }

  it("handles circular references", () => {
    const abc = { a: 1, b: 2, c: 3, d: 4, e: 5 } as Abc;
    abc.xyz = abc;
    const result = pruneDeep(abc, (p) => {
      if (typeof p.value === "number") return p.value < 4;
      return true;
    });
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
    expect(result.c).toBe(3);
    expect(result.d).toBeUndefined();
    expect(result.e).toBeUndefined();
    expect(result.xyz).toBeDefined();
    expect(result.xyz === result).toBe(true);
    expect(result.xyz!.a).toBe(1);
    expect(result.xyz!.b).toBe(2);
    expect(result.xyz!.c).toBe(3);
    expect(result.xyz!.d).toBeUndefined();
    expect(result.xyz!.e).toBeUndefined();
    expect(result.xyz!.xyz).toBeDefined();
    expect(result.xyz!.xyz === result.xyz).toBe(true);
  });
});
