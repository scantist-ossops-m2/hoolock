import iterateProperties from "./iterateProperties";
import returnInitialArgument from "./returnInitialArgument";
import type { Mapped } from "../types";
import setSafeProperty from "./setSafeProperty";

/** Copies non-existant properties from a source object to a target object. */
function copyProperties(
  to: Mapped,
  from: Mapped,
  recurse = returnInitialArgument
) {
  iterateProperties(from, (key, value) => {
    setSafeProperty(to, key, () => recurse(value));
  });
  return to;
}

export default copyProperties;
