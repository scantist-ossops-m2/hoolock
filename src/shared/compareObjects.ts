import type { Mapped } from "../types";

const compareObjects = (
  a: Mapped,
  b: Mapped,
  compare: (a: any, b: any) => boolean
) => {
  // Compare arrays
  if (Array.isArray(a)) {
    if (!(Array.isArray(b) && a.length === b.length)) return false;
    for (let i = 0; i < a.length; i++)
      if (!compare(a[i], b[i])) {
        return false;
      }
    return true;
  }
  // Compare objects
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  for (const key of keys) {
    // "key in" should be much faster than saving Object.keys(b) and running .includes
    if (!(key in b && compare(a[key], b[key]))) return false;
  }

  return true;
};

export default compareObjects;
