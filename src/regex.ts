import isArray from "./isArray";
import isRegExp from "./isRegExp";
import type { MaybeArray } from "./types";

namespace RegexFlag {
  export type Known = "g" | "i" | "m" | "s" | "u" | "y";
}
type RegexFlag = RegexFlag.Known | (string & {});

/**
 * A couple of helpers for working with regular expressions.
 * - `regex(pattern, [flags])`
 *   - Creates a regular expression.
 * - `regex.escape(str)`
 *   - Escapes special regex characters within a string.
 */
const regex = /* @__PURE__ */ (() => {
  const extractSource = (exp: RegExp | string) =>
    isRegExp(exp) ? exp.source : exp;

  /**
   * Simple helper for creating regular expressions. The pattern parameter can (optionally) accept an array of strings, which will be joined together with an empty string.
   * @example
   * ```js
   * import regex from "hoolock/regex";
   *
   * regex("foo|bar", "g");
   * // -> /foo|bar/g
   *
   * regex(["foo", "|", "bar"], "g");
   * // -> /foo|bar/g
   * ```
   */
  function regex(exp: MaybeArray<RegExp | string>, flag?: RegexFlag) {
    const source = isArray(exp)
      ? exp.map(extractSource).join("")
      : extractSource(exp);

    return new RegExp(source, flag);
  }

  const escExp = /[\\^$*+?.()|[\]{}]/g;

  /**
   * Escapes special regex characters within a string.
   * @example
   * ```js
   * import regex from "hoolock/regex";
   *
   * regex.escape("f.oo");
   * // -> "f\.oo"
   *
   * regex.escape("foo|bar");
   * // -> "foo\|bar"
   * ```
   */
  regex.escape = (str: string) => str.replace(escExp, "\\$&");

  return regex;
})();

const t = regex("d");

export default regex;
export type { RegexFlag, MaybeArray };

// regex
