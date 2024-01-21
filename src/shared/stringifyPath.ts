import { Path } from "../types";

const stringifyPath = /* @__PURE__ */ (() => {
  type Stringifier<T> = (value: T) => [str: string, delimit?: boolean];
  const NUMBER = /^\d+(?:\.\d+)?$/;
  const NO_QUOTES = /^[a-zA-Z_$][\w$]*$/;
  const QUOTE_ESCAPE = /"/g;

  const symbolString: Stringifier<symbol> =
    "description" in Symbol.prototype
      ? (value) => [`[Symbol("${value.description}")]`]
      : () => [`[Symbol()]`];

  const string: Stringifier<string | symbol> = (value) => {
    if (typeof value === "symbol") return symbolString(value);
    if (NUMBER.test(value)) {
      const num = Number(value);
      if (!Number.isNaN(num)) return [`[${num}]`];
    }
    if (NO_QUOTES.test(value)) return [value, true];
    value = `["${value.replace(QUOTE_ESCAPE, '\\"')}"]`;
    return [value];
  };
  return (path: Array<string | symbol>): string => {
    if (!path.length) return "";
    let result = string(path[0]),
      str = result[0];
    for (let i = 1; i < path.length; i++) {
      result = string(path[i]);
      if (result[1]) str += ".";
      str += result[0];
    }
    return str;
  };
})();

export default stringifyPath;
