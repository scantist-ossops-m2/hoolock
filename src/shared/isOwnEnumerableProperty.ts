const isOwnEnumerableProperty = (obj: {}, key: string | number | symbol) =>
  Object.hasOwnProperty.call(obj, key) &&
  Object.propertyIsEnumerable.call(obj, key);

export default isOwnEnumerableProperty;
