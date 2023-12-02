import capitalize from "./capitalize";

describe("capitalize", () => {
  it("capitalizes the first letter of a string", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
  it("lowercases the rest of the string", () => {
    expect(capitalize("HELLO")).toBe("Hello");
  });
});
