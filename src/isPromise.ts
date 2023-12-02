/**
 * Checks if the provided value is a Promise.
 * @example
 * ```js
 * import isPromise from "hoolock/isPromise";
 *
 * isPromise(Promise.resolve());
 * // -> true
 *
 * isPromise("foo");
 * // -> false
 * ```
 */
const isPromise = <T = any>(value: any): value is Promise<T> =>
  value instanceof Promise;

export default isPromise;
