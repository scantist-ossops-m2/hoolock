import { Entry, parseEntries } from "../entries";
import * as rollup from "./rollup";
import { cleanDir } from "../util/cleanDir";
import { getPackage } from "../util/getPackage";
import path from "path";
import bundleTypes from "./bundleTypes";

export const bundleEntries = async (): Promise<Entry[]> => {
  const pkg = getPackage(),
    entries = parseEntries();

  const indexFile = path.join(pkg.src, "index.ts"),
    input: Record<string, string> = {
      index: indexFile,
    };

  entries.forEach((e) => {
    input[e.id] = e.file;
  });

  // Clean existing dist
  await cleanDir(pkg.dist);

  await bundleTypes(entries);

  // Follow up with the .js files
  for (const format of ["cjs", "esm"] as const) {
    const inp = { ...input };

    const extension = format === "cjs" ? "js" : "mjs";

    await rollup.build(
      {
        input: inp,
        plugins: [
          rollup.commonjs(),
          rollup.comments(),
          // rollup.resolve(),
          rollup.nodeResolve(),
          rollup.swc({
            minify: false,
            root: pkg.dir,
            exclude: /node_modules|bin/,
            tsconfig: pkg.tsConfig,
            module: {
              // Use es6, commonjs plugin will convert to commonjs
              type: "es6",
            },
            jsc: {
              transform: {},
              parser: {
                syntax: "typescript",
              },
              target: "esnext",
            },
          }),
        ],
      },
      {
        format,
        dir: format === "esm" ? path.join(pkg.dist, "esm") : pkg.dist,
        entryFileNames: `[name].${extension}`,
        chunkFileNames: `shared/[name].${extension}`,
      }
    );
  }

  return entries;
};
