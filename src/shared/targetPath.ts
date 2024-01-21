import isBoolean from "../isBoolean";
import toPath from "./toPath";
import type { Path, Mapped, ParentObjectCreator } from "../types";
import isString from "../isString";
import isPrivateProperty from "./isPrivateProperty";
import setProperty from "./setProperty";

const createPlainParent: ParentObjectCreator = () => ({});

const preventPrivate = (target: Mapped, key: PropertyKey) => {
  if (isPrivateProperty(target, key))
    throw new TypeError(
      `Property ${
        isString(key) ? `"${key}"` : String(key)
      } does not belong to target object and cannot be accessed.`
    );
};

const targetPath = (
  source: Mapped,
  pathlike: Path,
  createParent?: ParentObjectCreator | boolean
) => {
  const parentCreator = isBoolean(createParent)
    ? createParent
      ? createPlainParent
      : void 0
    : createParent ?? createPlainParent;

  const path = toPath(pathlike),
    fin = path.length - 1;

  let target: any = source,
    key: PropertyKey;

  for (let i = 0; i < fin; i++) {
    key = path[i];
    // if (key in target) {
    preventPrivate(target, key);
    target =
      target[key] ??
      (setProperty(target, key, parentCreator && parentCreator()), target[key]);
  }

  key = path[fin];
  preventPrivate(target, key);

  return {
    target,
    key,
    path,
  };
};

export default targetPath;
