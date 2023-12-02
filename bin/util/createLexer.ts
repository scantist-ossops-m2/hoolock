export type Token<T extends number | string> = {
  type: T | null;
  value: string;
};

const tryParse = <T extends number | string>(value: string): T => {
  try {
    const parsed = parseInt(value);
    if (!isNaN(parsed)) return parsed as T;
  } catch (e) {}
  return value as T;
};

export const createLexer = <T extends number | string>(
  map: Record<T, RegExp>
) => {
  const matchers = Object.keys(map).map((key) => {
    return {
      type: tryParse<T>(key),
      match: map[key as unknown as T],
    };
  });

  const nextToken = (input: string) => {
    for (const { type, match } of matchers) {
      const matchResult = input.match(match);
      if (matchResult && matchResult.index === 0) {
        return {
          type,
          value: matchResult[0],
        };
      }
    }
    return undefined;
  };

  return (input: string) => {
    const tokens: Token<T>[] = [];
    let remaining = input,
      unknown = "",
      token: Token<T> | undefined;

    while (remaining.length > 0) {
      token = nextToken(remaining);
      if (token) {
        if (unknown) {
          tokens.push({
            type: null,
            value: unknown,
          });
          unknown = "";
        }
        tokens.push(token);
        remaining = remaining.slice(token.value.length);
      } else {
        unknown += remaining[0];
        remaining = remaining.slice(1);
      }
    }

    if (unknown) tokens.push({ type: null, value: unknown });

    return tokens;
  };
};
