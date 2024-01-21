import { Mapped } from "../types";
import isOwnProperty from "./isOwnProperty";

const isPrivateProperty = (object: Mapped, key: PropertyKey) => {
  return key in object && !isOwnProperty(object, key);
};

export default isPrivateProperty;
