import isOwnProperty from "./isOwnProperty";
import isEnumerableProperty from "./isEnumerableProperty";

const isOwnEnumerableProperty = <T extends {}>(
  obj: T,
  key: string | number | symbol
) => isOwnProperty(obj, key) && isEnumerableProperty(obj, key);

export default isOwnEnumerableProperty;
