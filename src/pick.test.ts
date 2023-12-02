import type { Mapped, Path } from "./types";
import pick from "./pick";

type PartialDeep<T extends Mapped> = {
  [K in keyof T]?: T[K] extends Mapped ? PartialDeep<T[K]> : T[K];
};

describe("pick", () => {
  const picks = <O extends Mapped>(
    name: string,
    object: O,
    keys: Path[],
    expected: PartialDeep<O>
  ) => {
    it(name, () => {
      const result = pick(object, ...keys);
      expect(result).toEqual(expected);
    });
  };

  picks("keys from an object", { a: 1, b: 2, c: 3 }, ["a", "c"], {
    a: 1,
    c: 3,
  });

  picks(
    "indices from an array",
    [1, 2, 3, 4, 5],
    [0, 2, 4],
    [1, undefined, 3, undefined, 5]
  );

  picks("handles invalid keys", { a: 1, b: 2, c: 3 }, ["a", "d", "e"], {
    a: 1,
  });

  picks(
    "nested properties",
    {
      a: { b: { c: 1 }, d: { e: 2, f: { g: 3 } } },
      b: { c: 4, d: 5 },
      c: { d: 5 },
    },
    ["a.b.c", "a.d.f.g", "b.d"],
    {
      a: { b: { c: 1 }, d: { f: { g: 3 } } },
      b: { d: 5 },
    }
  );

  picks(
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
      ],
      b: [0, 1, 2, 3, 4],
      c: { d: [0, 1, 2, 3, 4] },
    } as const,
    ["a[1].b.c", "b[1]", "b[3]"],
    {
      a: [, { b: { c: 1 } }],
      b: [, 1, , 3],
    }
  );

  const sym = Symbol("sym");

  picks(
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
    { a: { [sym]: { c: 3 } } }
  );
});
