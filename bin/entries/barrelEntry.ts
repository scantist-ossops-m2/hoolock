import path from "path";
import { getPackage } from "../util/getPackage";
import { Entry } from "./parseEntries";

const barrelEntry = (): Omit<Entry, "file"> => {
  const { dist } = getPackage();
  const joinDist = (f: string) => path.join(dist, f);

  const entryPaths = {
    import: "./esm/index.mjs",
    require: "./index.js",
    types: "./index.d.ts",
  };

  return {
    id: "index",
    name: "",
    sort: -1,
    dist: {
      main: joinDist(entryPaths.require),
      module: joinDist(entryPaths.import),
      types: joinDist(entryPaths.types),
      entry: ".",
      entryPaths: entryPaths,
    },
  };
};

export default barrelEntry;
