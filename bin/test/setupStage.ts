import shell from "shelljs";
import { getPackage } from "../util/getPackage";
import fs from "fs";
import path from "path";
import { bundleEntries } from "../bundle";
import { buildDistribution } from "../distribution";
import createCacheDir from "../util/createCacheDir";
import { TsConfigJson } from "type-fest";
// import {PackageJson} from 'type-fest'

const isBuildFile = /\.(m?js|\.d.ts)$/;

const packageDist = async (testDir: string) => {
  const dist = getPackage().dist;

  if (
    !fs.existsSync(dist) ||
    !fs.readdirSync(dist).some((file) => isBuildFile.test(file))
  ) {
    console.log("\nCould not find dist, building now...");
    // If the dist package hasn't been built yet,
    // we want to build it now
    const bundledFiles = await bundleEntries();
    await buildDistribution(bundledFiles);
    console.log("Done bundling, prepping tests...");
  }

  const res = shell.exec(
    "npm pack --pack-destination=" + JSON.stringify(testDir),
    {
      cwd: dist,
      silent: true,
    }
  );

  if (res.code !== 0) {
    console.error("Error packing distribution.");
    console.error(res.stderr);
    process.exit(1);
  }

  const tgz = res.stdout.trim(),
    tgzPath = path.join(testDir, tgz);

  // Need to rename it to something random,
  // npm does some sort of cache otherwise,
  // and the build isn't updated
  const tarball = path.join(testDir, "hoolock-" + Date.now() + ".tgz");
  await fs.promises.rename(tgzPath, tarball);

  return tarball;
};

export const setupStage = async (deps: Record<string, string> = {}) => {
  // const main = getPackage(),
  // testDir = path.join(main.dir, "node_modules/.cache/staging");

  const testDir = createCacheDir("testing");

  try {
    await fs.promises.rm(testDir, {
      recursive: true,
    });
  } catch (e) {}

  await fs.promises.mkdir(testDir, {
    recursive: true,
  });

  const tarball = await packageDist(testDir);

  await fs.promises.writeFile(
    path.join(testDir, "package.json"),
    JSON.stringify(
      {
        name: "hootest",
        private: true,
        version: "1.0.0",
        devDependencies: {
          ...(deps || {}),
          hoolock: "file:" + tarball,
        },
      },
      null,
      2
    )
  );

  const tsConfig: TsConfigJson = {
    compilerOptions: {
      composite: false,
      declaration: true,
      declarationMap: true,
      esModuleInterop: true,
      inlineSources: false,
      isolatedModules: true,
      moduleResolution: "node",
      noUnusedLocals: false,
      noUnusedParameters: false,
      preserveWatchOutput: true,
      skipLibCheck: true,
      strict: true,
      lib: ["ESNext"],
      target: "esnext",
      module: "esnext",
      noEmit: true,
      resolveJsonModule: true,
      allowJs: true,
    },
    exclude: ["node_modules"],
    include: ["*.ts", "*.js", "*.tsx", "*.jsx", "*.mjs", "*.cjs"],
  };

  await fs.promises.writeFile(
    path.join(testDir, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
  );

  const res = shell.exec("npm i", {
    cwd: testDir,
    silent: true,
  });

  if (res.code !== 0) {
    console.error("Error installing test dependencies.");
    console.error(res.stderr);
    process.exit(1);
  }

  return testDir as string;
};

export type Stage = {
  name: string;
  format: "cjs" | "esm";
  contents: string;
};
