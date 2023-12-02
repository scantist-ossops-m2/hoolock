import emptyObjectFrom from "./shared/emptyObjectFrom";
import transformSource, {
  TransformRule,
  TransformResult,
} from "./shared/transformSource";

interface TransformContext {
  key: PropertyKey;
  value: any;
  /** Source object this property is on. */
  source: object;
  /** Target object this property is being set on. This is the new, transformed object currently being created. */
  target: object;
}

type Transformer = (
  context: TransformContext
) => TransformRule | void | undefined;

/**
 * Iterates over the enumerable properties of a source object and creates a new object based on the results of the callback function.
 * The callback is invoked with an object containing information on the property being evaluated, and can return any of the following rulings:
 * - __Copy the property as-is__: `true` or `undefined`
 * - __Adjust the copied property__: `{ value: any, key?: PropertyKey }`
 * - __Omit the property__: `false` or `{ skip: true }`
 *
 * To recursively transform an object, use __transformDeep__.
 * @example
 * ```js
 * import transform from "hoolock/transform";
 *
 * transform(
 *   {
 *     name: "Gibbon",
 *     family: "Hylobatidae",
 *     diet: ["Fruits", "Leaves", "Insects"],
 *   },
 *   (property) => {
 *     if (typeof property.value === "string") {
 *       return { value: property.value.toLowerCase() };
 *     }
 *     if (Array.isArray(property.value)) {
 *       return { value: property.value.join(", ").toLowerCase() };
 *     }
 *   }
 * );
 * // => {
 * //   name: 'gibbon',
 * //   family: 'hylobatidae',
 * //   diet: 'fruits, leaves, insects'
 * // }
 * ```
 */
function transform<T extends object>(
  source: T,
  transformer: ({
    key,
    value,
    target,
    source,
  }: TransformContext) => TransformRule | void | undefined
): TransformResult<T> {
  return transformSource(transformer, emptyObjectFrom(source), source) as any;
}

export default transform;
export type { TransformRule, TransformContext, Transformer, TransformResult };
