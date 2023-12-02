/**
 * Checks if the provided value has the `Object` prototype, e.g. an object defined with bracket notation (`{}`). Will not return true for other objects (arrays, classes, functions, etc).
 *
 * @example
 * ```js
 * import isPlainObject from "hoolock/isPlainObject";
 *
 * isPlainObject({});
 * // -> true
 *
 * isPlainObject(new Map());
 * // -> false
 * ```
 */
const isPlainObject = (
  value: any
): value is Record<string | number | symbol, unknown> => {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
};

export default isPlainObject;
