import type { AnyArray, Path } from "../types";
import isOwnProperty from "./isOwnProperty";
import toPath from "./toPath";

export namespace PathTrie {
  export interface Node {
    nodes?: PathTrie;
    target?: boolean;
  }
}
export interface PathTrie {
  [key: string | symbol]: PathTrie.Node;
}

const getNode = (
  object: PathTrie,
  key: PropertyKey
): PathTrie.Node | undefined => {
  if (key in object) {
    if (!isOwnProperty(object, key)) return;
    return object[key];
  }
  return (object[key] ??= {} as any);
};

const setNode = (trie: PathTrie, path: Array<string | symbol>) => {
  if (!path.length) return;
  let node = getNode(trie, path[0]);
  for (let i = 1; i < path.length; i++) {
    if (!node) return;
    node = getNode((node.nodes ??= {}), path[i]);
  }
  if (node) node.target = true;
};

const pathTrie = (pathlike: AnyArray<Path>): PathTrie => {
  const trie: PathTrie = {};
  for (const path of pathlike) setNode(trie, toPath(path));
  return trie;
};

export default pathTrie;
