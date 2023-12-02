import cloneComplex from "./shared/cloneComplex";
import returnInitialArgument from "./shared/returnInitialArgument";

/**
 * Creates a __shallow__ clone of an object.
 * - __Will clone__: Arrays, Sets, Maps, Dates, Errors, RegExps, Plain objects, Promises, Classes
 * - __Will _not_ clone__: React elements, Functions, Buffers, Nested objects
 * 
 * For a recursive/deep clone, use __cloneDeep__.
 * @example
 *
 * ```js
 * import clone from "hoolock/clone";
 *
 * const gibbon = { name: "Gibbon", diet: ["Fruits", "Leaves"] };
 *
 * const gibbonClone = clone(gibbon);
 * //  -> { name: 'Gibbon', diet: ['Fruits', 'Leaves'] };
 *
 * console.log(gibbon === gibbonClone);
 * //  -> false
 *
 * // Nested objects are not cloned, use cloneDeep to clone recursively:
 * console.log(gibbon.diet === gibbonClone.diet);
 * //  -> true
 * ```
```
 */
const clone = <T>(obj: T): T => cloneComplex(obj, returnInitialArgument);

export default clone;
