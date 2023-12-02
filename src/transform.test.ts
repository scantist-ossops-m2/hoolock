import transform, { TransformContext } from "./transform";

describe("transformDeep", () => {
  const createPropertyGetter = (
    source: Record<PropertyKey, any>,
    // Need the finished target because the 'target' properties in params
    // will have been mutated by the time mock.calls is accessed.
    target: Record<PropertyKey, any>
  ) => {
    return (key: PropertyKey): TransformContext => {
      const value = source[key];
      return {
        key,
        source,
        target,
        value,
      };
    };
  };

  it("calls the transformer for each property", () => {
    const transformer = jest.fn<undefined, [TransformContext]>(() => {});
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const property = createPropertyGetter(
      object,
      transform(object, transformer)
    );
    expect(transformer).toHaveBeenCalledTimes(4);
    expect(transformer).toHaveBeenCalledWith(property("a"));
    expect(transformer).toHaveBeenCalledWith(property("b"));
    expect(transformer).toHaveBeenCalledWith(property("c"));
    expect(transformer).toHaveBeenCalledWith(property("d"));
  });

  it("keeps properties that have returned void or undefined", () => {
    expect(transform({ a: 1, b: 2, c: 3 }, () => void 0)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it("keeps properties that have returned true", () => {
    expect(transform({ a: 1, b: 2, c: 3 }, () => true)).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it("keeps properties that have returned a 'value' key", () => {
    expect(
      transform({ a: 1, b: 2, c: 3 }, ({ value }) => ({
        value,
      }))
    ).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  it('skips properties with a "skip" key', () => {
    expect(transform({ a: 1, b: 2, c: 3 }, () => ({ skip: true }))).toEqual({});
  });

  it("skips properties that return false", () => {
    expect(transform({ a: 1, b: 2, c: 3 }, () => false)).toEqual({});
  });

  it("uses the returned value as the new value for the property", () => {
    expect(
      transform({ a: 1, b: 2, c: 3 }, ({ value }) => ({
        value: typeof value === "number" ? value + 1 : value,
      }))
    ).toEqual({
      a: 2,
      b: 3,
      c: 4,
    });
  });

  it("returns a copy of the object", () => {
    const object = { a: 1, b: 2, c: 3, d: { e: 4 } };
    const result = transform(object, ({ value }) => ({ value }));
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });

  it("does not mutate the original object", () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    const result = transform(object, ({ value }) => ({
      value: typeof value === "number" ? value + 1 : value,
    }));
    const expected = {
      a: 2,
      b: 3,
      c: 4,
      d: 5,
    };
    expect(result).toEqual(expected);
    expect(object).not.toEqual(expected);
  });

  it('uses the "key" property', () => {
    const object = { a: 1, b: 2, c: 3, d: 4 };
    let int = 0;
    const result = transform(object, ({ key, value }) => {
      return {
        key: (key as string) + int++,
        value,
      };
    });
    expect(result).toEqual({
      a0: 1,
      b1: 2,
      c2: 3,
      d3: 4,
    });
  });

  it("filters arrays (doesn't set removed to undefined)", () => {
    const obj = [0, -1, 10, -50, 100, -1000];

    const result = transform(obj, ({ value }) => {
      if (typeof value === "number") {
        if (value < 0) return { skip: true };
      }
    });

    expect(result).toEqual([0, 10, 100]);
  });

  it("iterates over array indices and properties once", () => {
    const transformer = jest.fn<undefined, [TransformContext]>(() => {});
    const array = Object.assign([1, 2, 3], { a: 1, b: 2, c: 3 });
    const result = transform(array, transformer);
    const property = createPropertyGetter(array, result);
    expect(transformer).toHaveBeenCalledTimes(6);
    expect(transformer).toHaveBeenCalledWith(property(0));
    expect(transformer).toHaveBeenCalledWith(property(1));
    expect(transformer).toHaveBeenCalledWith(property(2));
    expect(transformer).toHaveBeenCalledWith(property("a"));
    expect(transformer).toHaveBeenCalledWith(property("b"));
    expect(transformer).toHaveBeenCalledWith(property("c"));
  });
});
