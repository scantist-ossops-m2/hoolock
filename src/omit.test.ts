import type { Mapped, Path } from "./types";
import omit from "./omit";

type PartialDeep<T extends Mapped> = {
  [K in keyof T]?: T[K] extends Mapped ? PartialDeep<T[K]> : T[K];
};

describe("omit", () => {
  const omits = <O extends Mapped>(
    name: string,
    object: O,
    keys: Path[],
    expected: PartialDeep<O>
  ) => {
    it(name, () => {
      const result = omit(object, ...keys);
      expect(result).toEqual(expected);
    });
  };

  omits("keys from an object", { a: 1, b: 2, c: 3 }, ["a", "c"], {
    b: 2,
  });

  omits("indices from an array", [1, 2, 3, 4, 5], [0, 2, 4], [, 2, , 4]);

  omits("handles invalid keys", { a: 1, b: 2, c: 3 }, ["a", "d", "e"], {
    b: 2,
    c: 3,
  });

  omits(
    "nested properties",
    {
      a: { b: { c: 1 }, d: { e: 2, f: { g: 3 } } },
      b: { c: 4, d: 5 },
      c: { d: 5 },
    },
    ["a.b.c", "a.d.f", "b.d"],
    {
      a: {
        b: {},
        d: { e: 2 },
      },
      b: { c: 4 },
      c: { d: 5 },
    }
  );

  omits(
    "nested array indices",
    {
      a: [
        ,
        {
          b: {
            c: 1,
          },
          c: {
            d: 2,
          },
        },
        {
          d: {
            e: 2,
          },
        },
      ] as const,
      b: [0, 1, 2, 3, 4],
      c: { d: [0, 1, 2, 3, 4] },
    },
    ["a[1].b", "b[1]", "b[3]"],
    {
      a: [, { c: { d: 2 } }, { d: { e: 2 } }],
      b: [0, , 2, , 4],
      c: { d: [0, 1, 2, 3, 4] },
    }
  );

  const sym = Symbol("sym");

  omits(
    "array keys",
    {
      a: {
        b: 2,
        [sym]: {
          d: 3,
          c: 3,
        },
      },
    },
    [["a", sym, "c"]],
    {
      a: {
        b: 2,
        [sym]: {
          d: 3,
        },
      },
    }
  );
});
