/**
 * Checks if the provided value is null.
 * @example
 * ```js
 * import isNull from "hoolock/isNull";
 *
 * isNull(null);
 * // -> true
 *
 * isNull(undefined) || isNull("foo");
 * // -> false
 * ```
 */
const isNull = (value: any): value is null => value === null;

export default isNull;
