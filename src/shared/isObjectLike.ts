import type { Mapped } from "../types";

const isObjectLike = (obj: any): obj is Mapped =>
  typeof obj === "object" && obj !== null;

export default isObjectLike;
