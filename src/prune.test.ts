import prune, { PruneContext } from "./prune";

describe("prune", () => {
  const createPropertyGetter = (
    source: Record<PropertyKey, any>,
    // Need the finished target because the 'target' properties in params
    // will have been mutated by the time mock.calls is accessed.
    target: Record<PropertyKey, any>
  ) => {
    return (key: PropertyKey): PruneContext => {
      const value = source[key];
      return {
        key,
        source,
        target,
        value,
      };
    };
  };

  it("calls the predicate for each property", () => {
    const predicate = jest.fn<boolean, [PruneContext]>(() => true);
    const object = { a: 1, b: 2, c: 3 };
    const result = prune(object, predicate);
    const property = createPropertyGetter(object, result);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenCalledWith(property("a"));
    expect(predicate).toHaveBeenCalledWith(property("b"));
    expect(predicate).toHaveBeenCalledWith(property("c"));
  });

  it("returns a shallow copy of the object", () => {
    const object = { a: 1, b: 2, c: 3 };
    const result = prune(object, () => true);
    expect(result).toEqual(object);
    expect(result).not.toBe(object);
  });

  it('removes properties for which the predicate returns "false"', () => {
    const object = { a: 1, b: 2, c: 3 };
    const result = prune(object, () => false);
    expect(result).toEqual({});
  });

  it('removes array elements for which the predicate returns "false"', () => {
    const array = [1, 2, 3];
    const result = prune(array, () => false);
    expect(result).toEqual([]);
  });

  it("iterates over array indices and properties", () => {
    const array = [1, 2, 3] as any;
    array.a = 1;
    array.b = 2;
    array.c = 3;
    const predicate = jest.fn<boolean, [PruneContext]>((property) => {
      if (property.value === 2) return false;
      return true;
    });

    const result = prune(array, predicate);

    const property = createPropertyGetter(array, result);

    expect(predicate).toHaveBeenCalledTimes(6);
    expect(predicate).toHaveBeenCalledWith(property(0));
    expect(predicate).toHaveBeenCalledWith(property(1));
    expect(predicate).toHaveBeenCalledWith(property(2));
    expect(predicate).toHaveBeenCalledWith(property("a"));
    expect(predicate).toHaveBeenCalledWith(property("b"));
    expect(predicate).toHaveBeenCalledWith(property("c"));

    expect(result).toEqual(
      Object.assign([1, 3], {
        a: 1,
        c: 3,
      })
    );
  });

  it("is not recursive", () => {
    const array = [0, 1, [0, 1]];
    const predicate = jest.fn<boolean, [PruneContext]>(() => true);
    const result = prune(array, predicate);
    const property = createPropertyGetter(array, result);
    expect(result).toEqual([0, 1, [0, 1]]);
    expect(result[2]).toBe(array[2]);
    expect(predicate).toHaveBeenCalledTimes(3);
    expect(predicate).toHaveBeenCalledWith(property(0));
    expect(predicate).toHaveBeenCalledWith(property(1));
    expect(predicate).toHaveBeenCalledWith(property(2));
  });
});
