import areObjectsEqual from "./shared/compareObjects";
import wrapObjectEquality from "./shared/completeCompare";
import isStrictEqual from "./isStrictEqual";

/**
 * Performs a shallow equality check between two objects and their enumerable properties. For deep equality, use __isEqual__.
 * @example
 * ```js
 * import isMatch from "hoolock/isMatch";
 *
 * isMatch(
 *  { species: "Hoolock Gibbon", foods: "Fruits and Insects" },
 *  { species: "Hoolock Gibbon", foods: "Fruits and Insects" },
 * );
 * // -> true
 *
 * isMatch(
 *  { species: "Hoolock Gibbon", foods: "Fruits and Insects" },
 *  { species: "Hoolock Gibbon", foods: "Fruits and Leaves" },
 * );
 * // -> false
 * ```
 */
const isMatch = /* @__PURE__ */ ((): ((
  compare: any,
  against: any
) => boolean) => {
  return wrapObjectEquality((a, b) => areObjectsEqual(a, b, isStrictEqual));
})();

export default isMatch;
