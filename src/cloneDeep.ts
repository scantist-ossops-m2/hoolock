import cloneComplex from "./shared/cloneComplex";
import deepClone from "./shared/deepClone";
/**
 * Creates a __deep__ clone of an object and its enumerable own properties. Handles circular references, perserving them in the cloned object.
 *
 * - __Will clone__: Arrays, Sets, Maps, Dates, Errors, RegExps, Plain objects, Promises, Classes, Circular references, Nested objects
 *
 * - __Will _not_ clone__: React elements, Functions, Buffers
 * @example
 * ```js
 * import cloneDeep from "hoolock/cloneDeep";
 *
 * const gibbon = { name: "Gibbon", diet: ["Fruits", "Leaves"] };
 * const gibbonClone = cloneDeep(gibbon);
 * // -> { name: 'Gibbon', diet: ['Fruits', 'Leaves'] };
 *
 * console.log(gibbon === gibbonClone);
 * // -> false
 *
 * console.log(gibbon.diet === gibbonClone.diet);
 * // -> false
 * ```
 */
const cloneDeep = <T>(source: T) => deepClone(cloneComplex)(source);

export default cloneDeep;
