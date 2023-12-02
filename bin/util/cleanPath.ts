import p from "path";

const sep = p.sep,
  sepl = sep.length;

/** Remove tailing/leading slashes */
export const cleanPath = (path: string) => {
  while (path.startsWith(sep)) path = path.slice(sepl);
  while (path.endsWith(p.sep)) path = path.slice(0, -sepl);
  return path;
};
