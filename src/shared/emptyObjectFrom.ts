import type { Mapped } from "../types";

function emptyObjectFrom<T extends Mapped>(object: T) {
  if (typeof object !== "object" || object === null) return {};
  if (Array.isArray(object)) return [];
  return Object.create(Object.getPrototypeOf(object));
}

export default emptyObjectFrom;
