/**
 * Checks if the provided value is an array.
 * @example
 * ```js
 * import isArray from "hoolock/isArray";
 *
 * isArray([1, 2, 3]);
 * // -> true
 *
 * isArray("foo");
 * // -> false
 * ```
 */
const isArray = /* @__PURE__ */ Array.isArray.bind(Array) as (
  value: any
) => value is any[];

export default isArray;
