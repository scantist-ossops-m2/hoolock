/**
 * Checks if the given value is an non-null object.
 * @example
 * ```js
 * import isObject from "hoolock/isObject";
 *
 * isObject({}) && isObject(new Date()) && isObject(() => {});
 * // -> true
 *
 * isObject(null) || isObject("foo");
 * // -> false
 * ```
 */
const isObject = (value: any): value is object => {
  const type = typeof value;
  return (type === "object" && value !== null) || type === "function";
};

export default isObject;
