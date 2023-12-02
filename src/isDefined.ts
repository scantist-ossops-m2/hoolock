/**
 * Checks if the provided value is defined (not undefined).
 * @example
 * ```js
 * import isDefined from "hoolock/isDefined";
 *
 * isDefined("foo");
 * // -> true
 *
 * isDefined(undefined);
 * // -> false
 * ```
 */
const isDefined = <T>(value: T): value is Exclude<T, undefined | void> =>
  typeof value !== "undefined";

export default isDefined;
