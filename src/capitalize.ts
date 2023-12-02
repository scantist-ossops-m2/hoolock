/**
 * Capitalizes the first character in a string and lowercases the rest.
 * @example
 * ```js
 * import capitalize from "hoolock/capitalize";
 *
 * capitalize('HOOLOCK GIBBON');
 * // -> 'Hoolock gibbon'
 * ```
 */
const capitalize = (string: string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

export default capitalize;
