import cloneSimple from "./shared/cloneSimple";
import deepClone from "./shared/deepClone";
import emptyObjectFrom from "./shared/emptyObjectFrom";
import isObjectLike from "./shared/isObjectLike";
import iterateProperties from "./shared/iterateProperties";
import pathTrie, { PathTrie } from "./shared/pathTrie";
import setSafeProperty from "./shared/setSafeProperty";
import type { Mapped, Path } from "./types";

function pickRecursive(
  target: Mapped,
  source: Mapped,
  trie: PathTrie,
  clone: <T>(value: T) => T
) {
  iterateProperties(source, (key, value) => {
    const node = trie[key];
    if (node) {
      if (node.target) {
        // If the node is a target, then we want to copy the entire value
        return setSafeProperty(target, key, () => clone(value));
      }
      // Otherwise, check to see if the node has any children
      if (node.nodes) {
        // If it does, then we want to copy the shape of the object,
        // and traverse down to pick the children
        if (!isObjectLike(value)) {
          // If it's not an object, then we cannot traverse down it.
          // Maybe copy the whole value instead here? Not sure.
          return;
        }
        if (setSafeProperty(target, key, () => emptyObjectFrom(value))) {
          pickRecursive(target[key], value, node.nodes, clone);
        }
        return;
      }
    }
  });
  return target;
}

/**
 * Returns a copy of the provided object that only contains the specified paths.
 * @example
 * ```js
 * import pick from "hoolock/pick";
 *
 * pick(
 *   {
 *     name: "Gibbon",
 *     family: "Hylobatidae",
 *     diet: ["fruits", "leaves", "insects"],
 *   },
 *   "name",
 *   "family"
 * );
 * // -> { name: 'Gibbon', family: 'Hylobatidae' }
 *
 * ```
 */
function pick<T extends object, K extends Array<keyof T>>(
  source: T,
  ...keys: K
): Pick<T, K[number]>;
function pick<T extends object>(source: T, ...paths: Path[]): Partial<T>;
function pick(source: object, ...paths: Path[]): object {
  return pickRecursive(
    emptyObjectFrom(source),
    source,
    pathTrie(paths),
    deepClone(cloneSimple)
  );
}

export default pick;
export type { Path };
