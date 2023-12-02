import fs from "fs";
import path from "path";

const keepFiles = [
    "package.json",
    "package-lock.json",
    "README.md",
    "readme.md",
    "jest.config.js",
    "node_modules",
    "tsconfig.json",
    ".gitignore",
    ".git",
    ".",
  ],
  keepFilesEsc = keepFiles.map((f) => f.replace(".", "\\.")).join("|"),
  keepFile = new RegExp(`^(${keepFilesEsc})$`);

/**
 * Clears everything in a directory,
 * besides some important files.
 */
export const cleanDir = async (dir: string) => {
  try {
    const files = await fs.promises.readdir(dir);
    for (const file of files)
      if (!keepFile.test(file)) {
        await fs.promises.rm(path.join(dir, file), {
          recursive: true,
        });
      }
  } catch (e) {
    const code = e && (e as any).code;
    if (code === "ENOENT" || code === "ENOTDIR") return;
    throw e;
  }
};
