import path from "path";
import { getPackage } from "../util/getPackage";
import { withCache } from "../util/withCache";
import { MinEntry, parseMinEntries } from "./parseMinEntries";
import toRelPath from "../util/toRelPath";

export namespace Entry {
  export interface Dist {
    /** Absolute file path */
    main: string;
    /** Absolute file path */
    module: string;
    /** Absolute file path */
    types: string;
    /** Entry path for use in package.exports field. */
    entry: "." | (string & {});
    entryPaths: {
      import: string;
      require: string;
      types: string;
    };
  }
}

export interface Entry extends MinEntry {
  dist: Entry.Dist;
}

/** Parses/determines entries without extras, e.g. documentation */
const parseEntries = withCache((docs: boolean = true): Entry[] => {
  const pkg = getPackage();

  const createDist = (id: string): Entry.Dist => {
    const files = {
      main: id + ".js",
      module: "esm/" + id + ".mjs",
      types: id + ".d.ts",
    };

    const entry = toRelPath(id);

    return {
      main: path.join(pkg.dist, files.main),
      module: path.join(pkg.dist, files.module),
      types: path.join(pkg.dist, files.types),
      entry,
      entryPaths: {
        import: toRelPath(files.module),
        require: toRelPath(files.main),
        types: toRelPath(files.types),
      },
    };
  };

  return parseMinEntries().map((minEntry): Entry => {
    return {
      ...minEntry,
      dist: createDist(minEntry.id),
    };
  });
});

export { parseEntries };
