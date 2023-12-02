import parsePath from "../parsePath";
import type { Path } from "../types";

function toStringOrSymbol(key: string | number | symbol): string | symbol {
  switch (typeof key) {
    case "string":
    case "symbol":
      return key;
    default:
      return key.toString();
  }
}

function toPath(path: Path): Array<string | symbol> {
  switch (typeof path) {
    case "string":
      return parsePath(path);
    case "symbol":
      return [path];
    case "number":
      return [path.toString()];
    case "object":
      if (Array.isArray(path)) return path.map(toStringOrSymbol);
  }
  return [];
}

export default toPath;
export type { Path };
