export const removeEmptyLines = (lines: string[]): string[] => {
  let result: string[] = [];

  let previousLineEmpty = true;
  for (const line of lines) {
    if (line.trim() !== "") {
      result.push(line);
      previousLineEmpty = false;
    } else if (!previousLineEmpty) {
      result.push(line);
      previousLineEmpty = true;
    }
  }

  // Remove trailing empty lines
  while (result.length > 0 && result[result.length - 1].trim() === "") {
    result.pop();
  }

  return result;
};
