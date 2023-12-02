import update from "./update";

describe("update", () => {
  it("updates a property", () => {
    expect(update({ a: 1 }, "a", () => 2)).toEqual({ a: 2 });
  });

  it("provides expected context", () => {
    const obj = {
      foo: {
        bar: 1,
      },
      baz: {
        qux: [
          {
            quux: 2,
            set: 1,
          },
        ],
      },
    };

    let context: any;

    update(obj, '["baz"].qux[0].set', (ctx) => {
      context = ctx;
      return 2;
    });

    expect(context).toBeDefined();
    expect(context).toEqual({
      value: 1,
      target: obj.baz.qux[0],
      path: ["baz", "qux", "0", "set"],
      key: "set",
    });
  });

  it("updates nested property", () => {
    expect(
      update(
        {
          a: {
            b: [10],
          },
        },
        "a.b[0]",
        ({ value }) => value + 1
      )
    ).toEqual({
      a: {
        b: [11],
      },
    });
  });
});
