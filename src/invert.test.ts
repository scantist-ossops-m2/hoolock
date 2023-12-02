import invert from "./invert";
import { FlattenIntersection } from "./types";

describe("invert", () => {
  it("inverts key value pairs", () => {
    const result = invert({
      a: "x",
      b: 2,
      3: "c",
      [Symbol.for("d")]: "y",
      z: Symbol.for("e"),
    });
    expect(result).toBeDefined();
    expect(result).toEqual({
      x: "a",
      "2": "b",
      c: "3",
      y: Symbol.for("d"),
      [Symbol.for("e")]: "z",
    });
  });

  it("silently ignores impossible values", () => {
    const result = invert({
      a: () => {},
      b: null,
      c: undefined,
      d: {},
      e: [],
      i: true,
      j: false,
      k: new Date(),
    });
    expect(result).toBeDefined();
    expect(result).toEqual({});
  });

  // Random type tests, these won't function as normal tests;
  // however, Jest will show invalid types as errors

  const typeTest =
    <I>() =>
    <T>(i: T extends I ? T : never) =>
      i;

  // Mapped types
  typeTest<
    {
      [x: string]: "a" | "b" | undefined;
    } & {
      [x: number]: "d" | "c" | undefined;
    } & {
      [x: symbol]: "e" | undefined;
    }
  >()(
    invert({
      a: "a",
      b: "b",
      c: 10,
      d: 20,
      e: Symbol.for("e"),
      // xyz: "e",
    })
  );

  // Literal types
  typeTest<{
    x: "a";
    2: "b";
    c: 3;
  }>()(
    invert({
      a: "x" as const,
      b: 2 as const,
      3: "c" as const,
    })
  );

  // Literal union types
  typeTest<{
    e: "a" | "b" | undefined;
    f: "d" | "a" | "c" | undefined;
    g: "d" | undefined;
  }>()(
    invert({
      a: "e" as "e" | "f",
      b: "e" as "e",
      c: "f" as "f",
      d: "f" as "f" | "g",
    })
  );

  // Mixed mapped and literal types

  typeTest<
    {
      [x: string]: "a" | undefined;
    } & {
      [x: number]: "b" | undefined;
    } & {
      [x: symbol]: "e" | undefined;
    } & {
      x: "c";
      f: "d" | undefined;
      g: "d" | undefined;
    }
  >()(
    invert({
      a: "x",
      b: 2,
      c: "x" as const,
      d: "f" as "f" | "g",
      e: Symbol.for("e"),
    })
  );

  enum Enum {
    A = "a",
    B = "b",
    C = "c",
  }

  typeTest<{
    [Enum.A]: "A";
    [Enum.B]: "B";
    [Enum.C]: "C";
  }>()(invert(Enum));

  enum NumberEnum {
    A,
    B,
    C,
  }

  typeTest<
    {
      [x: number]: "A" | "B" | "C" | undefined;
    } & {
      [x: string]: number | undefined;
    }
  >()(invert(NumberEnum));
});
