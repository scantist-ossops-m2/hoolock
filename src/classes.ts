const injectClasses = (obj: any, classes: string[]): any => {
  if (obj) {
    let type = typeof obj;

    if (type === "string") {
      return classes.push(obj);
    }

    if (type === "object") {
      if (Array.isArray(obj)) {
        mapClasses(obj, classes);
        return;
      }

      // Exract keys from the object, if they have a truthy value
      // i.e. { "text-red": true, "text-blue": false } => "text-red"
      for (const key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key]) {
          classes.push(key);
        }

      return;
    }

    if (type === "function") {
      injectClasses(obj(), classes);
      return;
    }
  }
};

const mapClasses = (args: any[], classes: string[] = []) => {
  for (const arg of args) {
    injectClasses(arg, classes);
  }
  return classes;
};

/**
 * Merge separate CSS class names into a single string. Will combine nested arrays, the keys of objects with truthy values, the results of functions passed through it and ignore any other non-string/falsey values.
 *
 * @example
 * ```js
 * classes("text", true && "text-bold", 0 && "text-italic");
 * // -> "text text-bold"
 *
 * classes("text", {
 *   "text-bold": true,
 *   "text-italic": false,
 * });
 * // -> "text text-bold"
 *
 * classes("text", ["text-bold", ["text-italic"]]);
 * // -> "text text-bold text-italic"
 *
 * classes(
 *   "text",
 *   () => "text-bold",
 *   () => ({
 *     "text-italic": true,
 *   })
 * );
 * // -> "text text-bold text-italic"
 * ```
 */
const classes = (...args: any[]) => {
  return mapClasses(args).join(" ");
};

export default classes;
