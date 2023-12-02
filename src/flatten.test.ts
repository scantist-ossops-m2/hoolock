import flatten from "./flatten";

describe("flatten", () => {
  it("should completely flatten the array", () => {
    const arr = [1, [2, [3, [4]], 5]];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should flatten the array up to the specified depth", () => {
    const arr = [1, [2, [3, [4]], 5]];
    const result = flatten(arr, 2);

    expect(result).toEqual([1, 2, 3, [4], 5]);
  });

  it("should handle already flattened arrays", () => {
    const arr = [1, 2, 3, 4];
    const result = flatten(arr);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("should handle an empty array", () => {
    const arr: any[] = [];
    const result = flatten(arr);

    expect(result).toEqual([]);
  });
});
