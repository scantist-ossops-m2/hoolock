import { parseEntries } from "../entries";
import path from "path";
import fs from "fs";
import shell from "shelljs";
import { setupStage } from "./setupStage";
import { TestLog, defineTest, stringifyTestLog } from "./test.log";

const testModules = defineTest(
  async () => {
    const entries = parseEntries(),
      stage = await setupStage();

    const id = (...paths: string[]) => {
      return JSON.stringify(
        ["hoolock", ...paths]
          .filter(Boolean)
          .join("/")
          .replace(/\/index$/, "")
      );
    };

    const runModuleTests = async ({
      base = [],
      name,
      ...formats
    }: {
      cjs: string[];
      esm: string[];
      base?: string[];
      name: string;
    }): Promise<TestLog> => {
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, "_");

      const results = await Promise.all(
        (["cjs", "esm"] as const).map(async (format): Promise<TestLog> => {
          const file = path.join(
              stage,
              cleanName + "." + (format === "cjs" ? "js" : "mjs")
            ),
            contents = [...formats[format], ...(base || [])];

          await fs.promises.writeFile(file, contents.join("\n"));
          const res = shell.exec("node " + file, {
            cwd: stage,
            silent: true,
          });
          if (res.code !== 0) {
            let stderr = res.stderr.trim().split(/\r?\n/g);
            // const mainError = stderr.findIndex((l) => /^\s*Error\:\s/.test(l));
            // if (mainError !== 0) {
            //   const clean = stderr.slice(mainError);
            //   stderr = [];
            //   let passedAt = false;
            //   for (const line of clean) {
            //     if (/^\s*at\s/.test(line)) {
            //       passedAt = true;
            //       stderr.push(line);
            //     } else if (passedAt) {
            //       break;
            //     } else {
            //       stderr.push(line);
            //     }
            //   }
            // }
            return {
              name: format,
              pass: false,
              detail: ["Failed with error: ", ...stderr].join("\n"),
            };
          }
          return {
            name: format,
            pass: true,
          };
        })
      );

      const failed = results.filter((r) => !r.pass);

      if (failed.length) {
        return {
          pass: false,
          name,
          detail: failed.map((f) => stringifyTestLog(f)),
        };
      }

      return {
        pass: true,
        name,
      };
    };

    const exported: string[] = [];

    const tests = await Promise.all(
      [
        runModuleTests({
          name: "index",
          cjs: ['const _ = require("hoolock");'],
          esm: ['import * as _ from "hoolock";'],
          base: [
            "for (const name of " + JSON.stringify(exported) + ") {",
            "  const util = _[name];",
            '  if (typeof util !== "function") {',
            '    throw new Error("Expected " + name + " to be function, received " + typeof _ + inspect(util));',
            "  }",
            "}",
          ],
        }),
      ].concat(
        entries.map((entry) => {
          const importer = id(entry.id);
          return runModuleTests({
            name: entry.name,
            cjs: [`const _ = require(${importer});`],
            esm: [`import _ from ${importer};`],
            base: [
              'if (typeof _ !== "function") {',
              '  throw new Error("Expected function, received " + typeof _);',
              "}",
            ],
          });
        })
      )
    );

    const failed = tests.filter((t) => !t.pass);

    if (failed.length) return failed;

    return [
      {
        name: "hoolock",
        message: "The main index entry exports all utilities.",
        pass: true,
      },
      {
        name: "hoolock/*",
        message: "All unique utility entries function as expected.",
        pass: true,
      },
    ];
  },
  {
    name: "modules",
    spinner: "Validating module exports...",
    pass: "Successfully imported all modules in CJS/ESM environments.",
    fail: "Failed to import all modules in CJS/ESM environments.",
  }
);

export default testModules;
