/**
 * Returns a shuffled copy of an array. Does not modify the original array.
 *
 * If the array has a length greater than 1, a value will _never_ maintain it's original position within the shuffled array.
 * @example
 * ```js
 * import shuffle from "hoolock/shuffle";
 *
 * shuffle([1, 2, 3, 4, 5]);
 * // -> [3, 2, 5, 1, 4]
 * ```
 */
function shuffle<T>(array: T[] | readonly T[]): T[] {
  let shuffled = array.slice(0, array.length),
    j: number,
    x: T;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * i);
    x = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = x;
  }
  return shuffled;
}

export default shuffle;
