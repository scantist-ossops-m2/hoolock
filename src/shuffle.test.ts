import shuffle from "./shuffle";

describe("shuffle", () => {
  it("should return a shuffled array", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffle(array);
    expect(shuffled).not.toEqual(array);
    expect(shuffled.sort()).toEqual(array);
  });

  it("should not modify the original array", () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffle(array);
    expect(shuffled === array).toBe(false);
  });

  it("ensures values never end up in the same place", () => {
    for (let attempt = 0; attempt < 100; attempt++) {
      for (let len = 2; len < 5; len++) {
        const array = Array.from({ length: len }, (_, i) => i);
        const shuffled = shuffle(array);
        for (let i = 0; i < array.length; i++) {
          expect(shuffled[i]).not.toBe(i);
        }
      }
    }
  });
});
