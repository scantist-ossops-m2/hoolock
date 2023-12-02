import { parseMinEntries } from "../entries/parseMinEntries";
import { withCache } from "../util/withCache";

const getDescriptive = withCache(() => {
  const entries = parseMinEntries(),
    count = entries.length;

  const description = `Suite of ${count} lightweight utilities designed to maintain a small footprint when bundled, without compromising on ease of integration and use.`;

  return {
    description,
    entries,
    count,
  };
});

export default getDescriptive;
