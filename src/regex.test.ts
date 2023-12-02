import regex from "./regex";

describe("regex", () => {
  it("creates a regex from a string", () => {
    expect(regex("foo")).toEqual(/foo/);
  });

  it("creates a regex from a regex", () => {
    expect(regex(/foo/)).toEqual(/foo/);
  });

  it("creates a regex from an array", () => {
    expect(regex(["foo", "bar"])).toEqual(/foobar/);
  });

  it("creates a regex with flags", () => {
    expect(regex("foo", "g")).toEqual(/foo/g);
  });
});

describe("regex.escape", () => {
  it("escapes regex special characters", () => {
    expect(regex.escape("foo.bar")).toEqual("foo\\.bar");
  });
});
