import compareObjects from "./shared/compareObjects";
import completeCompare from "./shared/completeCompare";

/**
 * Performs a __deep__ equality check between two objects and their enumerable properties. For shallow equality use __isMatch__.
 *
 * Can compare objects with circular references.
 * @example
 * ```js
 * import isEqual from "hoolock/isEqual";
 *
 * isEqual(
 *   { species: "Gibbon", foods: ["Leaves", "Flowers"] },
 *   { species: "Gibbon", foods: ["Leaves", "Flowers"] },
 * );
 * // -> true
 *
 * isEqual(
 *   { species: "Orangutan", foods: ["Bark", "Insects"] },
 *   { species: "Orangutan", foods: ["Bark", "Insects", "Shoots"] },
 * );
 * // -> false
 * ```
 */
const isEqual = /* @__PURE__ */ ((): ((
  compare: any,
  against: any
) => boolean) => {
  type Visited = WeakMap<object, object>;
  type Same = (a: any, b: any) => boolean;
  const compare = completeCompare<[Visited, Same]>((a, b, visited, same) => {
    if (visited.has(a)) return visited.get(a) === b;
    visited.set(a, b);
    const areSame = compareObjects(a, b, same);
    visited.delete(a);
    return areSame;
  });
  return (a, b) => {
    const visited: Visited = new WeakMap(),
      same: Same = (a, b) => compare(a, b, visited, same);
    return same(a, b);
  };
})();

export default isEqual;
