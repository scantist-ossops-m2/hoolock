import isArray from "./isArray";
import isFunction from "./isFunction";
import setSafeProperty from "./shared/setSafeProperty";

type ShapeDynamicValues<K extends PropertyKey, T> = (key: K) => T;

type ShapeStaticValues<T> = {
  value: T;
};

type ShapeValues<K extends PropertyKey, T> =
  | ShapeDynamicValues<K, T>
  | ShapeStaticValues<T>;

/**
 * Used to create new arrays or objects filled with the provided static/dynamic values. The first argument will determine the type of object that will be returned:
 *
 * - __Arrays:__ Provide the desired length of the array (as a number).
 *
 * - __Objects:__ Pass through an array of keys (strings, numbers or symbols).
 *
 * Both accept the same value types:
 *
 * - __Static__<`{ value: any }`>: Provide a single value that will be used to fill the array/object via an object with a `value` property.
 * - __Dynamic__<`(key) => value`>: Provide a callback function that receives the current key/index and returns a value.
 * @example
 * ```js
 * import shape from "hoolock/shape";
 *
 * shape(3, { value: "gibbon" });
 * // -> ['gibbon', 'gibbon', 'gibbon']
 *
 * shape(["lar", "hoolock", "siamang"], (key) => key + " gibbon");
 * // -> { lar: 'lar gibbon', hoolock: 'hoolock gibbon', siamang: 'siamang gibbon' }
 * ```
 */
function shape<T>(length: number, values: ShapeValues<number, T>): T[];
function shape<T, K extends string | number | symbol>(
  keys: K[],
  values: ShapeValues<K, T>
): Record<K, T>;
function shape<T>(
  properties: number | Array<string | number | symbol>,
  values: ShapeValues<string | number | symbol, T> | ShapeValues<number, T>
): T[] | Record<string | number | symbol, T> {
  const generate = (
    isFunction(values) ? values : () => values.value
  ) as ShapeDynamicValues<string | number | symbol, T>;

  if (isArray(properties)) {
    const result: Record<string | number | symbol, T> = {};
    for (const property of properties) {
      setSafeProperty(result, property, () => generate(property));
    }
    return result;
  }

  const result: T[] = [];
  for (let i = 0; i < properties; i++) {
    result[i] = generate(i);
  }

  return result;
}

export default shape;
export type { ShapeValues, ShapeStaticValues, ShapeDynamicValues };
