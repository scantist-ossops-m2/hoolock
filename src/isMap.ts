/**
 * Checks if the provided value is a Map object.
 * @example
 * ```js
 * import isMap from "hoolock/isMap";
 *
 * isMap(new Map());
 * // -> true
 *
 * isMap({});
 * // -> false
 * ```
 */
const isMap = <K = any, V = any>(map: any): map is Map<K, V> =>
  map instanceof Map;

export default isMap;
