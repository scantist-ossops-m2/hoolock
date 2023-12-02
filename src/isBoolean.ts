/**
 * Checks if the provided value is a boolean.
 * @example
 * ```js
 * import isBoolean from "hoolock/isBoolean";
 *
 * isBoolean(true);
 * // -> true
 *
 * isBoolean("foo");
 * // -> false
 * ```
 */
const isBoolean = (value: any): value is boolean => typeof value === "boolean";

export default isBoolean;
