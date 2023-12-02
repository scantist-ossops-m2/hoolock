import { Entry, barrelEntry } from "../entries";
import { getPackage } from "../util/getPackage";
import { readdirSync } from "fs";
import getDescriptive from "./getDescriptive";

const IGNORE = ["node_modules", "package.json", "README.md"],
  COPY_FIELDS = ["license", "author", "repository", "bugs", "homepage"];

export const createPackageJson = async (entries: Entry[]) => {
  const { pkgJson: pkg, dist } = getPackage(),
    { description } = getDescriptive();

  const barrel = barrelEntry();
  const barrelPaths = barrel.dist.entryPaths;

  const copiedFields = COPY_FIELDS.reduce<Record<string, any>>((acc, field) => {
    if (field in pkg) acc[field] = pkg[field as keyof typeof pkg];
    return acc;
  }, {});

  const pkgJson = {
    name: "hoolock",
    version: pkg.version,
    description,
    main: barrelPaths.require,
    module: barrelPaths.import,
    types: barrelPaths.types,
    ...copiedFields,
    exports: {
      ".": {
        import: barrelPaths.import,
        require: barrelPaths.require,
        types: barrelPaths.types,
      },
    } as Record<string, Record<string, string>>,
    files: [] as string[],
    keywords: [] as string[],
    sideEffects: false,
  };

  pkgJson.files = readdirSync(dist).filter((file) => {
    return !IGNORE.includes(file);
  });

  entries.forEach(({ name, dist }) => {
    pkgJson.exports[dist.entry] = dist.entryPaths;
    if (!pkgJson.keywords.includes(name)) pkgJson.keywords.push(name);
  });

  return pkgJson;
};
