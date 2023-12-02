import isBoolean from "../isBoolean";
import toPath from "./toPath";
import type { Path, Mapped, ParentObjectCreator } from "../types";

const createPlainParent: ParentObjectCreator = () => ({});

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
    target = target[key] ??= (parentCreator && parentCreator()) as any;
  }

  key = path[fin];

  return {
    target,
    key,
    path,
  };
};

export default targetPath;
