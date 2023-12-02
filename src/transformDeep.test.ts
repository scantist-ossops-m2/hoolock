import transformDeep, { TransformDeepContext } from "./transformDeep";

describe("transformDeep", () => {
  const createPropertyGetter = (
    completeSource: Record<PropertyKey, any>,
    // Need the finished target because the 'target' properties in params
    // will have been mutated by the time mock.calls is accessed.
    finishedTarget: Record<PropertyKey, any>
  ) => {
    return (path: PropertyKey[]): TransformDeepContext => {
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

  it("calls the transformer for each property", () => {
    const transformer = jest.fn<undefined, [TransformDeepContext]>(() => {});
    const object = { a: 1, b: 2, c: 3, d: { e: 4, f: 5 } };
    const property = createPropertyGetter(
      object,
      transformDeep(object, transformer)
    );
    expect(transformer).toHaveBeenCalledTimes(6);
    expect(transformer).toHaveBeenCalledWith(property(["a"]));
    expect(transformer).toHaveBeenCalledWith(property(["b"]));
    expect(transformer).toHaveBeenCalledWith(property(["c"]));
    expect(transformer).toHaveBeenCalledWith(property(["d", "e"]));
    expect(transformer).toHaveBeenCalledWith(property(["d", "f"]));
    expect(transformer).toHaveBeenCalledWith(property(["d"]));
  });

  it("keeps properties that have returned void or undefined", () => {
    expect(transformDeep({ a: 1, b: 2, c: { d: 2 } }, () => void 0)).toEqual({
      a: 1,
      b: 2,
      c: { d: 2 },
    });
  });

  it("keeps properties that have returned a 'value' key", () => {
    expect(
      transformDeep({ a: 1, b: 2, c: { d: 2 } }, ({ value }) => ({
        value,
      }))
    ).toEqual({
      a: 1,
      b: 2,
      c: { d: 2 },
    });
  });

  it("uses the returned value as the new value for the property", () => {
    expect(
      transformDeep({ a: 1, b: 2, c: { d: 2 } }, ({ value }) => ({
        value: typeof value === "number" ? value + 1 : value,
      }))
    ).toEqual({
      a: 2,
      b: 3,
      c: { d: 3 },
    });
  });

  it("returns a deep copy of the object", () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    const result = transformDeep(object, ({ value }) => ({ value }));
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
    expect(result.d).not.toBe(object.d);
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    const result = transformDeep(object, ({ value }) => ({
      value: typeof value === "number" ? value + 1 : value,
    }));
    const expected = {
      a: 2,
      b: 3,
      c: 4,
      d: { e: 5 },
    };
    expect(result).toEqual(expected);
    expect(object).not.toEqual(expected);
  });

  it('uses the "key" property', () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    let int = 0;
    const result = transformDeep(object, ({ key, value }) => {
      return {
        key: (key as string) + int++,
        value,
      };
    });
    expect(result).toEqual({
      a0: 1,
      b1: 2,
      c2: 3,
      d4: { e3: 4 },
    });
  });

  it("passes newly created objects to the transformer", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 0,
        f: {
          g: 0,
        },
      },
    };

    const result = transformDeep(obj, ({ value }) => {
      if (typeof value === "number") {
        if (value <= 0) return { skip: true };
        return;
      }
      if (typeof value === "object") {
        if (Object.keys(value).length === 0) return { skip: true };
      }
    });

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it("filters arrays (doesn't set removed to undefined)", () => {
    const obj = [0, -1, 10, -50, 100, [0, -10, 100, -1000, 10000, [-300, 5]]];

    const result = transformDeep(obj, ({ value }) => {
      if (typeof value === "number") {
        if (value < 0) return { skip: true };
      }
    });

    expect(result).toEqual([0, 10, 100, [0, 100, 10000, [5]]]);
  });

  it("iterates over array indices and properties once", () => {
    const transformer = jest.fn<undefined, [TransformDeepContext]>(() => {});
    const array = Object.assign([1, 2, 3], { a: 1, b: 2, c: 3 });
    const result = transformDeep(array, transformer);
    const property = createPropertyGetter(array, result);
    expect(transformer).toHaveBeenCalledTimes(6);
    expect(transformer).toHaveBeenCalledWith(property([0]));
    expect(transformer).toHaveBeenCalledWith(property([1]));
    expect(transformer).toHaveBeenCalledWith(property([2]));
    expect(transformer).toHaveBeenCalledWith(property(["a"]));
    expect(transformer).toHaveBeenCalledWith(property(["b"]));
    expect(transformer).toHaveBeenCalledWith(property(["c"]));
  });
});
