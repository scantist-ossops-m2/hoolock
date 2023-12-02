import { parseEntries } from "../entries";
import { setupStage } from "./setupStage";

import fs from "fs";
import shell from "shelljs";
import path from "path";
import acorn from "acorn";
import { TestLog, defineTest } from "./test.log";

const ALWAYS_TEST: string[] = ["cloneDeep", "join", "regex", "pruneDeep"];

export interface Declaration {
  name: string;
  kind: string;
}

const parseDeclarations = (
  contents: string,
  type: "module" | "script" = "module"
) => {
  const declarations: Declaration[] = [];

  const ast = acorn.parse(contents, {
    sourceType: type,
    ecmaVersion: "latest",
  }) as any;

  if (ast.body) {
    ast.body.forEach((node: any) => {
      if (node.type && /^(Variable|Function)Declaration$/.test(node.type)) {
        let id = node.id;
        if (id) {
          id = id.name;
        } else if (node.declarations) {
          const zero = node.declarations[0];
          if (zero && zero.type === "VariableDeclarator") {
            id = zero.id?.name;
          }
        }

        if (typeof id !== "string") return;

        declarations.push({
          name: id,
          kind: node.kind ?? "var",
        });
      }
    });
  }

  return declarations;
};

const cleanFilename = (name: string) => name.replace(/[#<>+?|:*"\\/]/g, "_");

const BUNDLERS = ["esbuild", "rollup"] as const;
export type Bundler = (typeof BUNDLERS)[number];

export type ExtraDeclarations = {
  [B in Bundler]: Declaration[] | null;
};

type InputFile = {
  file: string;
  filename: string;
  name: string;
  format: "esm" | "cjs";
  ext: "mjs" | "js";
};

// type BundleResult = {}

const createCompareBundleDeclarations = ({ stage }: { stage: string }) => {
  const dist = path.join(stage, "dist");

  const exec = (...command: string[]) => {
    const result = shell.exec(command.join(" "), {
      cwd: stage,
      silent: true,
    });
    if (result.code !== 0) {
      console.error(`Bundler command failed: ${command.join(" ")}`);
      console.error(result.stderr);
      process.exit(1);
    }
  };

  const bundlers: Record<Bundler, (input: InputFile) => string> = {
    rollup: ({ file, filename, format, ext }) => {
      const outputFile = path.join(dist, "rollup_" + filename);
      exec(
        "npx rollup",
        "-i",
        file,
        "--format=" + format,
        "--file=" + outputFile,
        "--p=@rollup/plugin-node-resolve"
      );
      return outputFile;
    },
    esbuild: ({ file, filename, name, format, ext }) => {
      const outputFile = path.join(dist, filename);
      exec("npx tsup", "--entry." + name + "=" + file, "--format=" + format);
      return outputFile;
    },
  };

  const usedNames: Record<string, boolean> = {};

  const createInputFile = (
    contents: string,
    baseName: string = ""
  ): InputFile => {
    if (usedNames[baseName]) {
      baseName += "_";
      let int = 1;
      while (usedNames[baseName + int]) int++;
      baseName += int;
    }
    // while (us)
    // let name = baseName;

    const name = cleanFilename(baseName),
      { format, ext }: Pick<InputFile, "format" | "ext"> =
        /(import|export)/.test(contents)
          ? { format: "esm", ext: "mjs" }
          : { format: "cjs", ext: "js" },
      filename = name + "." + ext,
      file = path.join(stage, filename);

    fs.writeFileSync(file, contents, "utf8");

    return {
      file,
      filename,
      name,
      format,
      ext,
    };
  };

  return (fileContents: { compare: string; against: string; name: string }) => {
    const compare = createInputFile(
        fileContents.compare,
        fileContents.name + "_compare"
      ),
      against = createInputFile(
        fileContents.against,
        fileContents.name + "_against"
      );

    const result = BUNDLERS.reduce(
      (acc, bundler) => Object.assign(acc, { [bundler]: null }),
      {} as ExtraDeclarations
    );

    for (const bundler of BUNDLERS) {
      const compareFile = bundlers[bundler](compare),
        againstFile = bundlers[bundler](against);

      const compareDecl = parseDeclarations(
          fs.readFileSync(compareFile, "utf8")
        ),
        againstDecl = parseDeclarations(fs.readFileSync(againstFile, "utf8"));

      for (const decl of compareDecl) {
        // Esbuild might add a declaration named FILENAME_default, so ignore that.
        if (decl.name === compare.name + "_default") continue;

        if (!againstDecl.some((ad) => ad.name === decl.name)) {
          const target = (result[bundler] ??= []);
          if (!target.some((d) => d.name === decl.name)) target.push(decl);
        }
      }
    }

    return result;
  };
};

const shuffle = <T>(arr: T[]) => {
  let i = arr.length;
  while (i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const testTreeshaking = defineTest(
  async () => {
    const stage = await setupStage({
      tsup: "latest",
      //   rollup: "latest",
    });

    const compareBundleDeclarations = createCompareBundleDeclarations({
      stage,
    });

    const entries = parseEntries();

    const idHoolock = (id?: string) =>
      ["hoolock", id].filter(Boolean).join("/");

    const importHoolock = (id?: string) => JSON.stringify(idHoolock(id));

    shuffle(entries);
    const attempts = entries.slice(0, 4);

    for (const always of ALWAYS_TEST) {
      if (attempts.some((a) => a.id === always)) continue;
      const target = entries.find((e) => e.id === always);
      if (!target) continue;
      attempts.push(target);
    }

    return attempts.flatMap((x): TestLog => {
      const { rollup, esbuild } = compareBundleDeclarations({
        name: x.name,
        compare: [
          `import { ${x.name} as _ } from ${importHoolock()};`,
          `export default _;`,
        ].join("\n"),
        against: [
          `import _ from ${importHoolock(x.id)};`,
          `export default _;`,
        ].join("\n"),
      });

      if (rollup || esbuild) {
        return {
          name: x.name,
          pass: false,
          message: "Could not treeshake unused variables.",
          detail: [
            ...(rollup
              ? ["rollup:", ...rollup.map((d) => ` - ${d.name}`)]
              : []),
            ...(esbuild
              ? ["esbuild:", ...esbuild.map((d) => ` - ${d.name}`)]
              : []),
          ],
        };
      }

      return {
        name: x.name,
        pass: true,
        message: "No unused variables.",
        // message:
      };
    });

    // for (const x of attempts) {
    //   const { rollup, esbuild } = compareBundleDeclarations({
    //     name: x.name,
    //     compare: [
    //       `import { ${x.name} as _ } from ${importHoolock()};`,
    //       `export default _;`,
    //     ].join("\n"),
    //     against: [
    //       `import _ from ${importHoolock(x.id)};`,
    //       `export default _;`,
    //     ].join("\n"),
    //   });
    //   if (rollup || esbuild) {
    //     return createLog({ rollup, esbuild });
    //   }
    // }

    // return createLog({
    //   rollup: null,
    //   esbuild: null,
    // });
  },
  {
    name: "treeshake",
    spinner: "Attempting to treeshake entries...",
    pass: "Successfully treeshook unused variables from index import via rollup and esbuild.",
    fail: "Failed to treeshake unused variables from index import via rollup and esbuild.",
  }
);

export default testTreeshaking;
