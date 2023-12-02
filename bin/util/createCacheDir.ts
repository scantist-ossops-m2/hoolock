import path from "path";
import { getPackage } from "./getPackage";
import { withCache } from "./withCache";
import fs from "fs";

const refreshDir = (dir: string) => {
  try {
    fs.rmSync(dir, { recursive: true });
  } catch (e) {}

  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {}

  return dir;
};

// Use with cache so it only runs once
const createMainCacheDir = withCache(() => {
  const { dir } = getPackage();
  return refreshDir(path.join(dir, ".cache"));
});

const createCacheDir = (...sub: string[]) => {
  const cacheDir = createMainCacheDir();
  if (!sub.length) return cacheDir;
  return refreshDir(path.join(cacheDir, ...sub));
};

export default createCacheDir;
