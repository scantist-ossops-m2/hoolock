import emptyObjectFrom from "./shared/emptyObjectFrom";
import isSimpleObject from "./shared/isSimpleObject";
import transformObject, {
  TransformResult,
  TransformRule,
  TransformPropertyCreator as _CreateProperty,
} from "./shared/transformSource";
import type { TransformContext } from "./transform";

interface TransformDeepContext extends TransformContext {
  /** Path to the property (array of keys). */
  path: PropertyKey[];
}

type DeepTransformer = (
  context: TransformDeepContext
) => TransformRule | void | undefined;

/**
 * Recursively iterates over the enumerable properties of a source object and creates a new object based on the results of the callback function.
 * The callback is invoked with an object containing information on the property being evaluated, and can return any of the following rulings:
 * - __Copy the property as-is__: `true` or `undefined`
 * - __Adjust the copied property__: `{ value: any, key?: PropertyKey }`
 * - __Omit the property__: `false` or `{ skip: true }`
 *
 * Nested objects will be transformed before their parents. The callback will then be called with the value of the transformed child object - _not the original source._
 *
 * Circular references will not cause an infinite loop.
 * @example
 * ```js
 * import transformDeep from "hoolock/transformDeep";
 *
 * transformDeep(
 *   {
 *     name: "Gibbon",
 *     family: "Hylobatidae",
 *     diet: ["Fruits", "Leaves", "Insects"],
 *   },
 *   (property) => {
 *     if (typeof property.value === "string") {
 *       return { value: property.value.toLowerCase() };
 *     }
 *   }
 * );
 * // => {
 * //   name: 'gibbon',
 * //   family: 'hylobatidae',
 * //   diet: ['fruits', 'leaves', 'insects']
 * // }
 * ```
 */
function transformDeep<T extends object>(
  source: T,
  transformer: ({
    key,
    value,
    path,
    target,
    source,
  }: TransformDeepContext) => TransformRule | void | undefined
): TransformResult<T> {
  const visited = new WeakMap<object, object>();

  const create: _CreateProperty<TransformDeepContext> = (
    property,
    sourcePath
  ) => {
    const path = sourcePath.concat(property.key),
      value = isSimpleObject(property.value)
        ? visited.has(property.value)
          ? visited.get(property.value)
          : transform(property.value, path)
        : property.value;
    return {
      ...property,
      value,
      path,
    };
  };

  const transform = <T extends object>(source: T, path: any[]): object => {
    const target = emptyObjectFrom(source);
    visited.set(source, target);
    return transformObject(transformer, target, source, create, path);
  };

  return transform(source, []) as any;
}

export default transformDeep;
export type {
  TransformContext,
  DeepTransformer,
  TransformDeepContext,
  TransformRule,
  TransformResult,
};
