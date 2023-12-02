describe("isStrictEqual", () => {
  const load = () => {
    jest.resetModules();
    return require("./isStrictEqual").default as (x: any, y: any) => boolean;
  };

  const equalityTests = () => {
    // jest expect.toBe uses Object.is, so we can't use it here

    test("returns true for equal values", () => {
      const isStrictEqual = load();

      expect(isStrictEqual(5, 5) === true).toBeTruthy();
      expect(isStrictEqual(0, 0) === true).toBeTruthy();
      expect(isStrictEqual(-0, -0) === true).toBeTruthy();
      expect(isStrictEqual(NaN, NaN) === true).toBeTruthy();
      expect(isStrictEqual(Infinity, Infinity) === true).toBeTruthy();
      expect(isStrictEqual("hello", "hello") === true).toBeTruthy();
      expect(isStrictEqual(null, null) === true).toBeTruthy();
      expect(isStrictEqual(undefined, undefined) === true).toBeTruthy();
    });

    test("returns false for unequal values", () => {
      const isStrictEqual = load();

      expect(isStrictEqual(5, 6) === false).toBeTruthy();
      expect(isStrictEqual(-0, +0) === false).toBeTruthy();
      expect(isStrictEqual(5, "5") === false).toBeTruthy();
      expect(isStrictEqual({}, {}) === false).toBeTruthy();
      expect(isStrictEqual([], []) === false).toBeTruthy();
      expect(isStrictEqual(null, undefined) === false).toBeTruthy();
    });
  };

  describe("when Object.is is supported", () => {
    equalityTests();
  });

  describe("when Object.is is not supported", () => {
    let baseObjectIs: (x: any, y: any) => boolean;
    beforeAll(() => {
      baseObjectIs = Object.is;
      Object.is = undefined as any;
    });

    afterAll(() => {
      Object.is = baseObjectIs;
    });

    equalityTests();
  });
});
