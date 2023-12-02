import { bundleEntries } from "./bundle";
import { buildDistribution } from "./distribution";
import out from "./util/out";

const build = async () => {
  const start = Date.now();
  const bundledFiles = await bundleEntries();

  await buildDistribution(bundledFiles);

  out.success(
    "Bundled in %s",
    out.color.green(((Date.now() - start) / 1000).toFixed(2) + "s") +
      "\n  " +
      out.color.dim("Run distribution tests before publishing!")
  );
};

export default build;
