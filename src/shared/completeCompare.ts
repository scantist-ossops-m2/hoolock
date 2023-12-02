import isStrictEqual from "../isStrictEqual";
import type { Mapped } from "../types";

const completeCompare = <Args extends any[] = []>(
  compareObjects: (a: Mapped, b: Mapped, ...customArgs: Args) => boolean
) => {
  const compare = (a: any, b: any, ...args: Args) => {
    // Check strict equality to start
    if (isStrictEqual(a, b)) return true;
    // Compare types
    const type = typeof a;
    if (type !== typeof b) return false;
    // If a is not an object, then b is not an object either, and these
    // cannot be equal. If either are null, then they cannot be equal.
    if (type !== "object" || a === null || b === null) return false;

    // Otherwise, use the custom comparison function
    args.unshift(a, b);
    return compareObjects.apply(null, args as any);
  };

  return compare;
};

export default completeCompare;
