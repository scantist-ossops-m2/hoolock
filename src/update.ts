import targetPath from "./shared/targetPath";
import type { Path } from "./types";

interface UpdateContext<T = any> {
  key: PropertyKey;
  value: T;
  /** Path to the property being updated. */
  path: PropertyKey[];
  /** Target object that is being updated (last object in the path). This is the object the property is directly on. */
  target: object;
}

type Updater<T = any> = ({ key, value, target, path }: UpdateContext<T>) => any;

/**
 * Sets the path of an object to the return value of an updater callback function. Nested updates are supported via dot and bracket syntax. If a parent object within a path does not exist, it will be created (unless disabled via the fourth argument).
 *
 * The updater function will be invoked with a contextual object containing the current state of the target property.
 * @example
 * ```js
 * import update from "hoolock/update";
 *
 * const object = {
 *   foo: {
 *     bar: {
 *       baz: 1,
 *     },
 *   },
 * };
 *
 * update(object, "foo.bar.qux", ({ value }) => {
 *   return value * 10;
 * });
 * // -> { foo: { bar: { baz: 1, qux: 10 } } }
 *
 * // Disable automatic creation of missing parents:
 * update({}, "foo.bar", "baz", false);
 * // -> TypeError: Cannot set property 'bar' of undefined
 *
 * ```
 */
function update<T extends object, K extends keyof T>(
  target: T,
  path: K | [K] | readonly [K],
  updater: Updater<T[K]>,
  createParent?: (() => object) | boolean
): T;
function update<T extends object, K extends keyof T, K2 extends keyof T[K]>(
  target: T,
  path: [K, K2] | readonly [K, K2],
  updater: Updater<T[K][K2]>,
  createParent?: (() => object) | boolean
): T;
function update<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
>(
  target: T,
  path: [K, K2, K3] | readonly [K, K2, K3],
  updater: Updater<T[K][K2][K3]>,
  createParent?: (() => object) | boolean
): T;
function update<
  T extends object,
  K extends keyof T,
  K2 extends keyof T[K],
  K3 extends keyof T[K][K2],
  K4 extends keyof T[K][K2][K3],
>(
  target: T,
  path: [K, K2, K3, K4] | readonly [K, K2, K3, K4],
  updater: Updater<T[K][K2][K3][K4]>,
  createParent?: (() => object) | boolean
): T;
function update<T extends object>(
  target: T,
  path: Path,
  updater: Updater<any>,
  createParent?: (() => object) | boolean
): T;
function update(
  source: object,
  pathlike: Path,
  updater: Updater<any>,
  createParent?: (() => object) | boolean
): any {
  const { target, key, path } = targetPath(source, pathlike, createParent),
    value = target[key];

  target[key] = updater({
    target,
    path,
    key,
    value,
  });

  return source;
}

export type { Updater, UpdateContext, Path };
export default update;
