/**
 * Checks if the given value is a string.
 * @example
 * ```js
 * import isString from "hoolock/isString";
 *
 * isString("foo");
 * // -> true
 *
 * isString(1);
 * // -> false
 * ```
 */
const isString = (value: any): value is string =>
  typeof value === "string" || value instanceof String;

export default isString;
