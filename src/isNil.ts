/**
 * Checks if the provided value is null or undefined.
 * @example
 * ```js
 * import isNil from "hoolock/isNil";
 *
 * isNil(null);
 * // -> true
 *
 * isNil(undefined);
 * // -> true
 *
 * isNil("foo");
 * // -> false
 * ```
 */
const isNil = (obj: any): obj is null | undefined | void =>
  typeof obj === "undefined" || obj === null;

export default isNil;
