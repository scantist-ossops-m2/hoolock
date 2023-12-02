/**
 * Checks if the provided value is a function.
 * @example
 * ```js
 * import isFunction from "hoolock/isFunction";
 *
 * isFunction(() => {});
 * // -> true
 *
 * isFunction(new Function("return 1"));
 * // -> true
 *
 * isFunction("foo");
 * // -> false
 * ```
 */
const isFunction = (value: any): value is (...args: any) => any =>
  typeof value === "function" || value instanceof Function;

export default isFunction;
