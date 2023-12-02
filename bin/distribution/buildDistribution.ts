import { getPackage } from "../util/getPackage";
import { createPackageJson } from "./createPackageJson";
import fs from "fs";
import path from "path";
import { Entry } from "../entries";
import { createReadMe } from "./createReadMe";

const writeDistribution = async (
  ...rewrites: [relativePath: string, content: string][]
) => {
  const dist = getPackage().dist;

  for (const [file, content] of rewrites) {
    await fs.promises.writeFile(path.join(dist, file), content);
  }

  return dist;
};

export const buildDistribution = async (entries: Entry[]) => {
  const pkgJson = await createPackageJson(entries),
    readMe = await createReadMe(entries);

  await writeDistribution(
    ["package.json", JSON.stringify(pkgJson, null, 2)],
    ["README.md", readMe]
  );

  await fs.promises.writeFile(getPackage().readMe, readMe);
};
