import { existsSync, readFileSync, readdirSync } from "fs";
import { getPackage } from "../util/getPackage";
import { withCache } from "../util/withCache";
import path from "path";
import { warn } from "../util/out";

export interface MinEntry {
  /** Name of the entry. */
  name: string;
  /** ID of the entry. */
  id: string;
  /** Source file path. */
  file: string;
  sort: number;
}

const TS_FILE = /\.tsx?$/;
const KEEP = /\.[tj]sx?$/;
const IGNORE = /^(_|index\.)|\.test\.[tj]sx?$/;

const parseMinEntries = withCache(() => {
  const pkg = getPackage();

  const files = readdirSync(pkg.src, { withFileTypes: true });

  const indexContents = readFileSync(pkg.index, "utf8"),
    indexExported = [...indexContents.matchAll(/['"]\.\/([a-zA-Z]+)['"]/g)].map(
      ([, name]) => name
    );

  return files
    .reduce<MinEntry[]>((entries, file, i) => {
      const filename = file.name;
      // const { name: filename,  isFile } = file;
      if (!(file.isFile() && KEEP.test(filename)) || IGNORE.test(filename))
        return entries;

      const filepath = path.join(pkg.src, filename),
        name = filename.replace(TS_FILE, "");

      let sort = indexExported.indexOf(name);

      if (sort === -1) {
        warn(`"%s" is not exported in index file.`, name);
        sort = indexExported.length + i;
      }

      return entries.concat({
        id: name,
        name,
        file: filepath,
        sort,
      });
    }, [])
    .sort((a, b) => {
      if (a.sort !== b.sort) return a.sort - b.sort;
      return a.name.localeCompare(b.name);
    })
    .map((e, i) => ({ ...e, sort: i }));
});

export { parseMinEntries };
