const compareObj = (a: any, b: any): boolean => {
  if (Object.is(a, b)) return true;
  if (a === null || b === null) return false;

  const aType = typeof a,
    bType = typeof b;

  if (aType !== bType) return false;
  if (aType !== "object") return false;

  if (Array.isArray(a))
    return Array.isArray(b) && a.every((v, i) => compareObj(v, b[i]));

  const aKeys = Object.keys(a),
    bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys)
    if (!compareObj(a[key], b[key])) {
      return false;
    }

  return true;
};

export const withCache = <T extends (...args: any[]) => any>(
  fn: T,
  compareArgs: (a: Parameters<T>, b: Parameters<T>) => boolean = compareObj
) => {
  const cache: {
    args: Parameters<T>;
    result: ReturnType<T>;
  }[] = [];

  return ((...args: Parameters<T>) => {
    const cached = cache.find((c) => compareArgs(c.args, args));
    if (cached) return cached.result;
    const result = fn(...args);
    cache.push({ args, result });
    return result;
  }) as T;
};
