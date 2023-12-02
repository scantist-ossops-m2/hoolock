import isString from "./isString";

/**
 * Methods related to the joining of arrays into strings.
 * - `join`: Join an array with a delimiter and custom final delimiter (optional).
 * - `join.preset`: Create a custom join function that utilizes predefined delimiters.
 */
const join = /* @__PURE__ */ (() => {
  const isJoinNotEmpty = (el: any): boolean => {
    if (typeof el === "string") return el.length > 0;
    if (typeof el === "undefined" || el === null) return false;
    if (Array.isArray(el)) {
      return cleanJoinEmpties(el).length > 0;
    }
    return true;
  };

  const cleanJoinEmpties = (elements: any[]): any[] =>
    elements.filter(isJoinNotEmpty);

  const joinUniqueEndDelimiter = (
    elements: any[],
    delimiter: string,
    lastDelimiter: string
  ) => {
    if (elements.length > 2) {
      let last = elements.pop()!;
      return [elements.join(delimiter), last].join(lastDelimiter);
    }
    return elements.join(lastDelimiter);
  };

  const joinSameDelimiter = (elements: any[], delimiter: string) =>
    elements.join(delimiter);

  /**
   * Join an array of objects into a string. Internally uses the `Array.join` method; however, there are some differences:
   *
   * - Objects that are (or would be converted to) empty strings are completely excluded from the join to avoid two consecutive delimiters.
   * - Optionally supports a unique, final delimiter, i.e. _"Gorillas, Orangutans __and__ Gibbons"_.
   *
   * Does not deploy a custom method for converting objects to strings, instead relying upon the default conversions provided through `Array.join`. Also won't flatten arrays - they will be joined with a comma (per the default stringification behavior of `Array.join`).
   * @example
   * ```js
   * import join from "hoolock/join";
   *
   * join(["Gibbon", null, "", -1, undefined, ["Orangutans", [void 0]], false], " ");
   * // -> "Gibbon -1 Orangutans false";
   *
   * join(
   *   ["Gibbons", null, "Orangutans", "Gorillas", undefined, "Chimps", "Humans"],
   *   ", ",
   *   " and "
   * );
   * // -> "Gibbons, Orangutans, Gorillas, Chimps and Humans";
   * ```
   */
  const join = (
    elements: any[],
    delimiter: string = "",
    lastDelimiter?: string
  ) => {
    if (isString(lastDelimiter)) {
      return joinUniqueEndDelimiter(
        cleanJoinEmpties(elements),
        delimiter,
        lastDelimiter
      );
    }
    return joinSameDelimiter(cleanJoinEmpties(elements), delimiter);
  };

  /**
   * Create a custom join function that utilizes predefined delimiters. The returned function will have an `(...args)` signature.
   * @example
   * ```js
   * import join from "hoolock/join";
   *
   * const joinAmpersand = join.preset(", ", " & ");
   *
   * joinAmpersand("Gorillas", "Orangutans", "Gibbons");
   * // -> "Gorillas, Orangutans & Gibbons";
   * ```
   */
  join.preset = (delimiter: string, lastDelimiter?: string) => {
    if (isString(lastDelimiter)) {
      return (...elements: any[]) =>
        joinUniqueEndDelimiter(
          cleanJoinEmpties(elements),
          delimiter,
          lastDelimiter
        );
    }
    return (...elements: any[]) =>
      joinSameDelimiter(cleanJoinEmpties(elements), delimiter);
  };

  return join;
})();

export default join;
