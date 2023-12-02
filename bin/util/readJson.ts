import fs from "fs";

export const readJson = <T = any>(path: string) =>
  JSON.parse(fs.readFileSync(path, "utf-8")) as T;
