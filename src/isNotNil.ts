import isNil from "./isNil";

/**
 * Checks if the provided value is __not__ null or undefined.
 *
 * @example
 * ```js
 * import isNotNil from "hoolock/isNotNil";
 *
 * isNotNil("foo");
 * // -> true
 *
 * isNotNil(null) || isNotNil(undefined);
 * // -> false
 * ```
 */
const isNotNil = <T>(value: T): value is Exclude<T, null | undefined | void> =>
  !isNil(value);

export default isNotNil;
