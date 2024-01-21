const isEnumerableProperty = <T extends {}>(obj: T, key: PropertyKey) =>
  Object.propertyIsEnumerable.call(obj, key);

export default isEnumerableProperty;
