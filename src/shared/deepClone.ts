import type { Visited } from "../types";

const deepClone = (
  cloner: <T>(obj: T, recurse: <T>(obj: T) => T, visited: Visited) => T
) => {
  const visited: Visited = new WeakMap(),
    clone = <T>(obj: T): T => cloner(obj, clone, visited);
  return clone;
};

export default deepClone;
