type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type FlattenIntersection<T> = { [K in keyof T]: T[K] } & {};

type FlatUnionToIntersection<U> = FlattenIntersection<UnionToIntersection<U>>;

interface Property {
  /** The property's value. */
  value: any;
  /** The property's key. */
  key: PropertyKey;
  /** Source object this property is from. */
  source: object;
  /** Target object this property is being set on. */
  target: object;
  /** Path to this property (array of keys). */
  path: PropertyKey[];
}

type Defined<T> = Exclude<T, undefined>;

type AnyArray<T> = T[] | readonly T[];

type MaybeArray<T> = T | T[];

declare namespace Path {
  export type Part = string | number | symbol;
}

type Path = Path.Part | Path.Part[] | readonly Path.Part[];

type PartialDeep<T> = T extends Array<any>
  ? PartialDeep<T[number]>[]
  : T extends object
  ? { [K in keyof T]?: PartialDeep<T[K]> }
  : T;

type ParentObjectCreator = () => object;

type Mapped = Record<PropertyKey, any>;

type Visited = WeakMap<Mapped, Mapped>;

export type {
  Property,
  Defined,
  AnyArray,
  MaybeArray,
  PartialDeep,
  UnionToIntersection,
  FlattenIntersection,
  ParentObjectCreator,
  FlatUnionToIntersection,
  Mapped,
  Visited,
  Path,
};
