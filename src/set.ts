import setSafeProperty from "./shared/setSafeProperty";
import targetPath from "./shared/targetPath";
import type { Path } from "./types";

/**
 * Sets the value at a path of an object. Nested sets are supported via dot and bracket syntax. If a parent object within a path does not exist, it will be created (unless disabled via the fourth argument).
 *
 * To dynamically set the value via a callback function, use __update__.
 * @example
 * ```js
 * import set from "hoolock/set";
 *
 * const object = {
 *   foo: {
 *     bar: {
 *       baz: "qux",
 *     },
 *   },
 * };
 * set(object, "foo.bar.baz", "quux");
 * // -> { foo: { bar: { baz: 'quux' } } }
 *
 * // Disable automatic creation of missing parents:
 * set({}, "foo.bar", "baz", false);
 * // -> TypeError: Cannot set property 'bar' of undefined
 *
 * ```
 */
function set<T extends object, K extends keyof T>(
  target: T,
  path: K | [K] | readonly [K],
  value: T[K],
  createParent?: (() => object) | boolean
): T;
function set<T extends object, K extends keyof T, K2 extends keyof T[K]>(
  target: T,
  path: [K, K2] | readonly [K, K2],
  value: T[K][K2],
  createParent?: (() => object) | boolean
): T;
function set<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(
  target: T,
  path: [K, K2, K3] | readonly [K, K2, K3],
  value: T[K][K2][K3],
  createParent?: (() => object) | boolean
): T;
function set<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4],
  value: T[K][K2][K3][K4],
  createParent?: (() => object) | boolean
): T;
function set<T extends object>(
  target: T,
  path: Path,
  value: any,
  createParent?: (() => object) | boolean
): T;
function set(
  obj: object,
  path: Path,
  value: any,
  createParent?: (() => object) | boolean
): any {
  const { target, key } = targetPath(obj, path, createParent);
  setSafeProperty(target, key, {
    value,
  });
  return obj;
}

export default set;
export type { Path };
