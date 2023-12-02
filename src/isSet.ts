/**
 * Checks if the provided value is a Set object.
 * @example
 * ```js
 * import isSet from "hoolock/isSet";
 *
 * isSet(new Set());
 * // -> true
 *
 * isSet({});
 * // -> false
 * ```
 */
const isSet = <T = any>(value: any): value is Set<T> => value instanceof Set;

export default isSet;
