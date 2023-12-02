const hasKey = <T extends {}, K extends keyof T | string | number | symbol>(
  obj: T,
  key: K
): boolean => {
  try {
    return key in obj;
  } catch (e) {
    return false;
  }
};

export default hasKey;
