import ts from "typescript";
import { Entry } from "../entries";
import { warn } from "../util/out";
import createCacheDir from "../util/createCacheDir";
import { getPackage } from "../util/getPackage";
import { readJson } from "../util/readJson";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import * as rollup from "./rollup";

const rollupTypes = (input: string, output: string) =>
  rollup.build(
    {
      input,
      plugins: [rollup.dts()],
    },
    {
      file: output,
      format: "es",
    }
  );

const matchExportTypes = /export\s+type\s\{([^}]+)\}/g;

const parseExportedTypes = (entry: Entry) => {
  const srcFileContents = readFileSync(entry.file, "utf8"),
    types: {
      as: string;
      name: string;
    }[] = [];

  for (const [, typesStr] of srcFileContents.matchAll(matchExportTypes)) {
    const arr = typesStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    for (const type of arr) {
      const [name, as = name] = type.split(/\s+as\s+/);
      types.push({ name, as });
    }
  }

  return types;
};

const bundleTypes = async (entries: Entry[]) => {
  const pkg = getPackage(),
    cache = createCacheDir("types");

  const tsConfig = ts.parseJsonConfigFileContent(
      readJson(pkg.tsConfig),
      ts.sys,
      pkg.dir
    ),
    program = ts.createProgram(
      tsConfig.fileNames.filter((f) => {
        return !/\.test\.[tj]sx?$/.test(f);
      }),
      {
        ...tsConfig.options,
        noEmit: false,
        outDir: cache,
        declarationDir: cache,
        declaration: true,
        emitDeclarationOnly: true,
        declarationMap: false,
      }
    );

  const emitResult = program.emit();

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (diagnostics.length) {
    console.log(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => pkg.dir,
        getCanonicalFileName: (f) => f,
        getNewLine: () => "\n",
      })
    );
    process.exit(1);
  }

  // Run rollup plugin dts on the index file
  const distIndex = path.join(pkg.dist, "index.d.ts");
  await rollupTypes(path.join(cache, "src/index.d.ts"), distIndex);

  entries.forEach((e) => {
    const types = parseExportedTypes(e);

    const exports = types.concat({
      name: e.name,
      as: "default",
    });

    const contents = [
      "export { ",
      exports
        .map((e) => {
          if (e.name === e.as) return e.name;
          return `${e.name} as ${e.as}`;
        })
        .join(", "),
      ' } from "./index";',
    ].join("");

    writeFileSync(e.dist.types, contents, "utf8");
  });
};

export default bundleTypes;
