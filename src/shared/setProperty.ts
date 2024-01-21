import { Mapped } from "../types";

const setProperty = <T>(target: Mapped, key: PropertyKey, value: T) => {
  if (key === "__proto__") {
    Object.defineProperty(target, key, {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else {
    target[key] = value;
  }
};

export default setProperty;
