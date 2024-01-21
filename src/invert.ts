import isPropertyKey from "./shared/isPropertyKey";

import iterateProperties from "./shared/iterateProperties";
import setSafeProperty from "./shared/setSafeProperty";
import { FlattenIntersection, UnionToIntersection } from "./types";

namespace Invert {
  export type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

  export type ExtractLiteral<T> = T extends string
    ? string extends T
      ? never
      : T
    : T extends number
    ? number extends T
      ? never
      : T
    : never;

  export type ExtractNonLiteral<T> = T extends string
    ? string extends T
      ? T
      : never
    : T extends number
    ? number extends T
      ? T
      : never
    : T extends symbol
    ? T
    : never;

  export type AsPrimitive<T> = T extends string
    ? string
    : T extends number
    ? number
    : T extends symbol
    ? symbol
    : never;

  export type InvertLiteral<T> = {
    [K in keyof T as ExtractLiteral<T[K]>]: IsUnion<T[K]> extends true
      ? K | undefined
      : K;
  };

  export type PartialMappedInversion<T, U extends PropertyKey> = {
    [K in keyof T as T[K] extends U ? U : never]?: K;
  };

  // Creates an inverted mapped type with catch-all keys
  export type MappedInversion<T> = PartialMappedInversion<T, string> &
    PartialMappedInversion<T, number> &
    PartialMappedInversion<T, symbol>;

  export type InvertNonLiteral<T> = {
    [K in keyof T as AsPrimitive<ExtractNonLiteral<T[K]>>]?: K;
  };
}

type Invert<T> = FlattenIntersection<
  UnionToIntersection<Invert.InvertNonLiteral<T> & Invert.InvertLiteral<T>>
>;

/**
 * Returns a copy of the provided object with its enumerable own properties inverted (value => key, key => value). If a value is not a valid key (`string`, `number` or `symbol`), it will be silently ignored.
 * @example
 * ```js
 * import invert from "hoolock/invert";
 *
 * const Gibbon = { Hoolock: 0, Lar: 1, Siamang: 2 };
 *
 * invert(Gibbon);
 * // -> { 0: "Hoolock", 1: "Lar", 2: "Siamang" }
 * ```
 */
function invert<T extends Record<PropertyKey, unknown>>(source: T): Invert<T>;
function invert(source: Record<PropertyKey, any>): Record<PropertyKey, any> {
  const result: Record<PropertyKey, any> = {};
  iterateProperties(source, (key, value) => {
    if (isPropertyKey(value)) {
      setSafeProperty(result, value, {
        value: key,
      });
    }
  });
  return result;
}

export default invert;

export type { Invert, FlattenIntersection, UnionToIntersection };
