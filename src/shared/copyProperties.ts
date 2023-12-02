import iterateProperties from "./iterateProperties";
import returnInitialArgument from "./returnInitialArgument";
import type { Mapped } from "../types";

/** Copies non-existant properties from a source object to a target object. */
function copyProperties(
  to: Mapped,
  from: Mapped,
  recurse = returnInitialArgument
) {
  iterateProperties(from, (key, value) => {
    if (!(key in to)) to[key] = recurse(value);
  });
  return to;
}

export default copyProperties;
