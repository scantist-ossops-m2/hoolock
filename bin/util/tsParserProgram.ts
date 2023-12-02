import ts from "typescript";
import { TsConfigJson } from "type-fest";

const tsParserProgram = ({
  files,
  include,
  exclude,
  compilerOptions,
}: {
  files: string[] | ((parsed: string[]) => string[]);
  include?: string[];
  exclude?: string[];
  compilerOptions?: TsConfigJson.CompilerOptions;
}) => {
  const config = ts.parseJsonConfigFileContent(
    {
      compilerOptions: {
        ...compilerOptions,
        isolatedModules: true,
        moduleResolution: "node",
        noUnusedLocals: false,
        noUnusedParameters: false,
        skipLibCheck: true,
        strict: true,
        lib: ["esnext"],
        target: "esnext",
        module: "esnext",
        noEmit: true,
        allowJs: true,
      },
      include,
      exclude,
    },
    ts.sys,
    process.cwd()
  );

  //   config.fi
  const rootNames =
    typeof files === "function" ? files(config.fileNames) : files;

  const prog = ts.createProgram({
    // rootNames: files,
    rootNames,
    options: config.options,
  });

  const diag = ts.getPreEmitDiagnostics(prog);

  if (diag.length) {
    console.log(
      ts.formatDiagnosticsWithColorAndContext(diag, {
        getCurrentDirectory: () => process.cwd(),
        getCanonicalFileName: (f) => f,
        getNewLine: () => "\n",
      })
    );
    return process.exit(1);
  }

  prog.emit();

  return prog;
};

export default tsParserProgram;
