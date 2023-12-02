import join from "./join";

describe("join", () => {
  it("joins via a delimiter", () => {
    expect(join(["a", "b", "c"], " ")).toBe("a b c");
  });

  it("joins via a delimiter and last delimiter", () => {
    expect(join(["a", "b", "c"], " ", " and ")).toBe("a b and c");
  });

  it("stringifies objects", () => {
    expect(join([true, {}, ["a", "b", "c"], () => {}], " ")).toBe(
      "true [object Object] a,b,c () => { }"
    );
  });

  it("excludes objects that are resolved to empty strings", () => {
    expect(
      join(
        ["a", "", [], undefined, ["b"], "c", ["", undefined, [null, void 0]]],
        " "
      )
    ).toBe("a b c");
  });
});
