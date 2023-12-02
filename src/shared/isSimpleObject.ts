import type { Mapped } from "../types";

const isSimpleObject = (obj: any): obj is Mapped =>
  typeof obj === "object" && obj !== null;

export default isSimpleObject;
