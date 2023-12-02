import prettier from "prettier";
import { getPackage } from "../util/getPackage";
import { Entry } from "../entries";
import getDescriptive from "./getDescriptive";

const br = "\n",
  dbr = br.repeat(2);

const join = (args: any[], delimiter: string = ""): string => {
    return args
      .map((a) => {
        if (Array.isArray(a)) return join(a, delimiter);
        if (typeof a === "string" || typeof a === "number") return a;
        return "";
      })
      .join(delimiter);
  },
  merge = (...args: any[]): string => join(args),
  mergebr = (...args: any[]): string => join(args, br),
  mergedbr = (...args: any[]): string => join(args, dbr),
  mergesp = (...args: any[]): string => join(args, " ");

const anchor = (id: string) =>
  "#" +
  id
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

const link = (text: string, href: string) => merge("[", text, "](", href, ")");

const markdownTextToHtml = (markdown: string) => {
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  markdown = markdown.replace(/\*(.*?)\*/g, "<i>$1</i>");
  markdown = markdown.replace(/__(.*?)__/g, "<b>$1</b>");
  markdown = markdown.replace(/_(.*?)_/g, "<i>$1</i>");
  markdown = markdown.replace(/~~(.*?)~~/g, "<del>$1</del>");
  markdown = markdown.replace(/`(.*?)`/g, "<code>$1</code>");
  markdown = markdown.replace(/\n/g, "<br>");
  return markdown;
};

const expandable = (
  summary: string | [summary: string, openCta: string],
  ...lines: string[]
) => {
  const [summaryText, openText] = Array.isArray(summary)
    ? summary
    : [summary, "Expand"];

  return mergebr(
    "<details>",
    "<summary>",
    markdownTextToHtml(summaryText),
    "</summary>",
    "",
    ...lines,
    "",
    "</details>"
  );
};

const hashes = (count: number) => "#".repeat(Math.min(count, 6));

const heading = (count: number, ...words: string[]) =>
  [hashes(count), ...words].filter(Boolean).join(" ");

const xs = (...text: string[]) =>
  merge("<sup>", "<sub>", ...text, "</sub>", "</sup>");

export const createReadMe = async (entries: Entry[]) => {
  const { description, count } = getDescriptive();

  const principles: [
    name: string,
    ...description: string[],
    // description: string,
  ][] = [
    [
      "Tree-Shakable",
      "The main entry point exports all utilities as named exports; however, is designed to be tree-shakable by most modern bundlers.",
      "As of version `2.0.0`, each release has tree-shakability tested in [rollup](https://rollupjs.org/guide/en/) and [esbuild](https://esbuild.github.io/)",
      "(on minimal or default tree-shaking settings).\n\n",
      "Individual imports should not be necessary in most environments. Despite this, hoolock maintains a modular design,",
      `with a unique entry point for each of the ${count} utilities.`,
    ],
    [
      "Built-ins Preferred",
      "JavaScript's built-in functions, such as `Array.prototype.map`, `Array.prototype.forEach` and `Object.keys`, are prioritized to minimize size and improve performance.",
      "Utilities with built-in 'equivalents' are typically extensions. For example, `join` accepts a distinct, final delimiter; however, still leverages `Array.prototype.join` internally.",
    ],
    [
      "CJS & ESM Support",
      "Despite its compact size, hoolock contains builds for both CommonJS (CJS) and ECMAScript Modules (ESM).",
    ],
    [
      "React Compatible",
      "Several utilities were built with React integrations in mind. For example, `clone`, `cloneDeep` and `merge` will ignore/preserve React elements.",
      "Additionally, many utilities (e.g. `merge`) are immutable, following React's state management principles.",
    ],
  ];

  const overview = mergedbr(
    "## Features",
    mergebr(
      "<dl>",
      ...principles.flatMap(([name, ...description]) => {
        return [
          "<dt>",
          "",
          `**${name}** :white_check_mark:`,
          "",
          "</dt>",
          "<dd>",
          "",
          ...description,
          "",
          "</dd>",
        ];
      }),
      "</dl>"
    )
  );

  let contents = mergedbr(
    "# hoolock",
    mergesp(
      description,
      "Heavily inspired by [lodash](https://lodash.com/), I created hoolock to meet my own needs and preferences, which are primarily concerned with size."
    ),
    // entries
    //   .map((entry) => link("**" + entry.id + "**", anchor(entry.id)))
    //   .join(" • "),
    overview
  );
  contents = await prettier.format(contents, {
    parser: "markdown",
  });
  contents = contents.replace(/```SIGNATURE/g, "```js");
  return contents;
};
