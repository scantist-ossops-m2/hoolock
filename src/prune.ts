import transform from "./transform";

interface PruneContext {
  key: PropertyKey;
  value: any;
  /** Source object this property is on. */
  source: object;
  /** Target object this property is being set on. This is the new, pruned object currently being created. */
  target: object;
}
type PrunePredicate = (context: PruneContext) => boolean | void | undefined;

type Pruned<T> = T extends object
  ? T extends Array<any>
    ? T
    : { [K in keyof T]?: T[K] }
  : T;

/**
 * Iterates over the enumerable own properties of an object or array and returns a copy that exclusively contains properties the predicate returned `true` for. The predicate is invoked with
 * an object containing information on the property being pruned. Arrays _will not_ contain empty slots where pruned values once were.
 *
 * For a recursive/deep prune, use __pruneDeep__.
 * @example
 * ```js
 * import prune from "hoolock/prune";
 *
 * prune(
 *   {
 *     name: "Gibbon",
 *     family: "Hylobatidae",
 *     diet: ["fruits", "leaves", "insects"],
 *   },
 *   (property) => typeof property.value === "string"
 * );
 * // -> { name: 'Gibbon', family: 'Hylobatidae' }
 * ```
 */
function prune<T extends object>(
  source: T,
  predicate: ({
    key,
    value,
    target,
    source,
  }: PruneContext) => boolean | void | undefined
): Pruned<T>;
function prune(source: object, predicate: PrunePredicate): object {
  return transform(source, (property) => predicate(property) !== false);
}

export default prune;
export type { PrunePredicate, PruneContext, Pruned };
