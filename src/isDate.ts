/**
 * Checks if the provided value is a Date object.
 * @example
 * ```js
 * import isDate from "hoolock/isDate";
 *
 * isDate(new Date());
 * // -> true
 *
 * isDate("2021-01-01") || isDate(1625328000000);
 * // -> false
 * ```
 */
const isDate = (value: any): value is Date => value instanceof Date;

export default isDate;
