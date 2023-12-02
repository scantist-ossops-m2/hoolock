import isReactElement from "./isReactElement";
import type { Mapped } from "../types";

function isClonable(source: any): source is Mapped {
  return (
    typeof source === "object" &&
    source !== null &&
    !(isReactElement.Object(source) || source instanceof Function)
  );
}

export default isClonable;
