/**
 * Checks if the provided value is a __finite__ number.
 * @example
 * ```js
 * import isNumber from "hoolock/isNumber";
 *
 * isNumber(1) || isNumber(-1);
 * // -> true
 *
 * isNumber(Infinity) || isNumber('foo');
 * // -> false
 * ```
 */
const isNumber = (obj: any): obj is number =>
  typeof obj === "number" && isFinite(obj);

export default isNumber;
