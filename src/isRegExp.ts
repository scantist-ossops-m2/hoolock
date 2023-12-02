/**
 * Checks if the provided value is a RegExp object.
 * @example
 * ```js
 * import isRegExp from "hoolock/isRegExp";
 *
 * isRegExp(new RegExp("foo")) && isRegExp(/foo/);
 * // -> true
 *
 * isRegExp("foo");
 * // -> false
 * ```
 */
const isRegExp = (value: any): value is RegExp => value instanceof RegExp;

export default isRegExp;
