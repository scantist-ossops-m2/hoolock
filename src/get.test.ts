import get from "./get";

describe("get", () => {
  it("gets a property", () => {
    expect(get({ a: 1 }, "a")).toBe(1);
  });

  it("gets a nested property", () => {
    expect(get({ a: { b: 2 } }, "a.b")).toBe(2);
  });

  it("gets an array index", () => {
    expect(get({ a: [1, 2, 3] }, "a[1]")).toBe(2);
  });

  it("returns undefined for non-existent property", () => {
    expect(get({ a: 1 }, "b")).toBeUndefined();
  });

  it("gets a deeply nested property", () => {
    expect(
      get({ a: { b: { c: { d: [, , { e: 2 }] } } } }, "a.b.c.d[2].e")
    ).toBe(2);
  });

  it("utilizes a default value", () => {
    expect(get({}, "a.b.c.d", 2)).toBe(2);
  });
});
