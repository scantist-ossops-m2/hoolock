import fill from "./shape";

describe("shape", () => {
  it("shapes an array", () => {
    const sample = ["a", "b", "c", "d"];
    const result = fill(4, (index) => sample[index]);
    expect(result).toEqual(sample);
  });

  it("shapes an object", () => {
    const result = fill(["a", "b", "c", "d"], (key) => {
      switch (key) {
        case "a":
          return 1;
        case "b":
          return 2;
        case "c":
          return 3;
        case "d":
          return 4;
        default:
          throw new Error("Unexpected key");
      }
    });

    expect(result).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    });
  });

  it("shapes an object with symbols", () => {
    const a = Symbol("a");
    const b = Symbol("b");
    const c = Symbol("c");
    const d = Symbol("d");

    const result = fill([a, b, c, d], (key) => {
      switch (key) {
        case a:
          return 1;
        case b:
          return 2;
        case c:
          return 3;
        case d:
          return 4;
        default:
          throw new Error("Unexpected key");
      }
    });

    expect(result).toEqual({
      [a]: 1,
      [b]: 2,
      [c]: 3,
      [d]: 4,
    });
  });
});
