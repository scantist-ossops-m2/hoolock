const isPropertyKey = (name: any): name is PropertyKey => {
  const type = typeof name;
  return type === "string" || type === "number" || type === "symbol";
};

export default isPropertyKey;
