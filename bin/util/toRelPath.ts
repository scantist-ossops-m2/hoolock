import rmRelPrefix from "./rmRelPrefix";

const toRelPath = (...paths: string[]) => {
  return [".", ...paths.map((path) => rmRelPrefix(path))]
    .filter(Boolean)
    .join("/");
};

export default toRelPath;
