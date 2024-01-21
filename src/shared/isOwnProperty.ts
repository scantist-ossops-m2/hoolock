const isOwnProperty = <T extends {}>(obj: T, key: string | number | symbol) =>
  Object.hasOwnProperty.call(obj, key);

export default isOwnProperty;
