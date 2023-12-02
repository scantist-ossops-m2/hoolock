import path from "path";
import fs from "fs";
import { withCache } from "./withCache";

export const pkgNames = {
  dist: "hoolock",
  main: "hoolock-main",
};

const mainDir = (startDir: string = process.cwd()) => {
  let dir = startDir;

  do {
    const pkgJson = path.resolve(dir, "package.json");
    try {
      const contents = fs.readFileSync(pkgJson, "utf8");
      if (contents) {
        const parsed = JSON.parse(contents);
        if (parsed.name === pkgNames.main) {
          return [dir, parsed] as const;
        }
      }
    } catch (e) {}
  } while (dir !== (dir = path.resolve(dir, "..")));

  throw new Error("Could not locate main package dir");
};

/** Returns information regarding the 'master' package/workspace. */
export const getPackage = withCache(
  (): {
    dir: string;
    pkgJson: typeof import("../../package.json");
    tsConfig: string;
    readMe: string;
    entries: string;
    dist: string;
    src: string;
    index: string;
  } => {
    const [dir, pkgJson] = mainDir();

    return {
      dir,
      pkgJson,
      readMe: path.resolve(dir, "README.md"),
      tsConfig: path.resolve(dir, "tsconfig.json"),
      entries: path.resolve(dir, "entries.json"),
      dist: path.resolve(dir, "dist"),
      src: path.resolve(dir, "src"),
      index: path.resolve(dir, "src/index.ts"),
    };
  }
);

export type Package = ReturnType<typeof getPackage>;

export const getPackageVersion = withCache(() => {
  const main = getPackage();
  return main.pkgJson.version;
});
