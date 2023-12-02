/**
 * Checks if the provided value is an Error object.
 * @example
 * ```js
 * import isError from "hoolock/isError";
 *
 * isError(new Error("foo"));
 * // -> true
 *
 * isError("foo");
 * // -> false
 * ```
 */
const isError = (value: any): value is Error => value instanceof Error;

export default isError;
