import transformDeep from "./transformDeep";
import type { PartialDeep } from "./types";
import type { PruneContext } from "./prune";

interface PruneDeepContext extends PruneContext {
  /** Path to the property (array of keys). */
  path: PropertyKey[];
}

type PruneDeepPredicate = (
  context: PruneDeepContext
) => boolean | void | undefined;

type DeepPruned<T> = T extends object
  ? T extends Array<infer U>
    ? PartialDeep<U>[]
    : { [K in keyof T]?: PartialDeep<T[K]> }
  : T;

/**
 * Recursively iterates over the enumerable properties of a source object and returns a copy which only contains properties the predicate returned `true` for.
 * The predicate is invoked with an object containing information on the property being evaluated. Arrays _will not_ contain empty slots where pruned values once were.
 *
 * Nested objects will be pruned before their parents. The callback will then be called with the value of the pruned child object - _not the original source._
 *
 * Circular references are supported and will not cause an infinite loop.
 * @example
 * ```js
 * import pruneDeep from "hoolock/pruneDeep";
 *
 * pruneDeep(
 *   {
 *     foo: { bar: 1, baz: 2, qux: 3 },
 *     baz: { qux: -2, quux: -3, corge: -4 },
 *   },
 *   ({ key, value }) => {
 *     if (typeof value === "number") return value > 0;
 *     if (typeof value === "object") return Object.keys(value).length > 0;
 *     return true;
 *   }
 * );
 * // => {
 * //   foo: { bar: 1, baz: 2, qux: 3 },
 * // }
 * ```
 */
function pruneDeep<T extends object>(
  source: T,
  predicate: ({
    key,
    value,
    path,
    target,
    source,
  }: PruneDeepContext) => boolean | void | undefined
): DeepPruned<T>;
function pruneDeep(source: object, predicate: PruneDeepPredicate): object {
  return transformDeep(source, (property) => predicate(property) !== false);
}

export default pruneDeep;
export type {
  PartialDeep,
  PruneDeepPredicate,
  PruneDeepContext,
  PruneContext,
  DeepPruned,
};
