import type { AnyArray, Path } from "../types";
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

const setNode = (trie: PathTrie, path: Array<string | symbol>) => {
  if (!path.length) return;
  let node = (trie[path[0]] ??= {});
  for (let i = 1; i < path.length; i++)
    node = (node.nodes ??= {})[path[i]] ??= {};
  node.target = true;
};

const pathTrie = (pathlike: AnyArray<Path>): PathTrie => {
  const trie: PathTrie = {};
  for (const path of pathlike) setNode(trie, toPath(path));
  return trie;
};

export default pathTrie;
