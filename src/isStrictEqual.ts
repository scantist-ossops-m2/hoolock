/**
 * Determines whether or not two values are strictly equal.
 *
 * If `Object.is` is supported, this function will alias it. Otherwise, it will use a polyfill.
 *
 * @example
 * ```js
 * import isStrictEqual from "hoolock/isStrictEqual";
 *
 * isStrictEqual(1, 1);
 * // -> true
 *
 * const obj = { foo: "bar" };
 * isStrictEqual(obj, obj);
 * // -> true
 *
 * isStrictEqual(obj, { foo: "bar" });
 * // -> false
 * ```
 */
const isStrictEqual = /* @__PURE__ */ ((): ((x: any, y: any) => boolean) => {
  if (Object && typeof Object.is === "function") return Object.is.bind(Object);
  return (x: any, y: any) =>
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
})();

export default isStrictEqual;
