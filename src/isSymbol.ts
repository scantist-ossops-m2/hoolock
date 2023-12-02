/**
 * Checks if the provided value is a symbol.
 * @example
 * ```js
 * import isSymbol from "hoolock/isSymbol";
 *
 * isSymbol(Symbol("foo"));
 * // -> true
 *
 * isSymbol("foo");
 * // -> false
 * ```
 */
const isSymbol = (value: any): value is symbol => typeof value === "symbol";

export default isSymbol;
