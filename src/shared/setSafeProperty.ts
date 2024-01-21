import isFunction from "../isFunction";
import { Mapped } from "../types";
import isPrivateProperty from "./isPrivateProperty";
import setProperty from "./setProperty";

function setSafeProperty(
  target: Mapped,
  key: PropertyKey,
  options: {
    value: unknown;
  }
): boolean;
function setSafeProperty(
  target: Mapped,
  key: PropertyKey,
  makeValue: () => unknown
): boolean;
function setSafeProperty(
  target: Mapped,
  key: PropertyKey,
  input: { value: any } | (() => any)
): boolean {
  if (isPrivateProperty(target, key)) return false;
  setProperty(target, key, isFunction(input) ? input() : input.value);
  return true;
}

export default setSafeProperty;
