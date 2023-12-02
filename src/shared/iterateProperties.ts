export type PropertiesCallback = (key: string | symbol, value: any) => void;

/** Iterates over enumerable own properties (string or symbol). */
const iterateProperties = <T extends Record<string | symbol, any>>(
  object: T,
  callback: PropertiesCallback
) => {
  let key: string | symbol;

  for (key in object)
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      callback(key, object[key]);
    }

  for (key of Object.getOwnPropertySymbols(object)) {
    if (Object.prototype.propertyIsEnumerable.call(object, key)) {
      callback(key, object[key]);
    }
  }
};

export default iterateProperties;
