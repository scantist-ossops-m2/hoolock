/**
 * Checks if the provided value is undefined.
 * @example
 * ```js
 * import isUndefined from "hoolock/isUndefined";
 *
 * isUndefined(undefined);
 * // -> true
 *
 * isUndefined(null) || isUndefined("foo");
 * // -> false
 * ```
 */
const isUndefined = (obj: any): obj is undefined => typeof obj === "undefined";

export default isUndefined;
