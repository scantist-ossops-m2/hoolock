import ora from "ora";

const red = (s: string) => "\x1b[31m" + s + "\x1b[0m";
red.bold = (s: string) => "\x1b[1m\x1b[31m" + s + "\x1b[0m";
const green = (s: string) => "\x1b[32m" + s + "\x1b[0m";
green.bold = (s: string) => "\x1b[1m\x1b[32m" + s + "\x1b[0m";
const bold = (s: string) => "\x1b[1m" + s + "\x1b[0m";
const dim = (s: string) => "\x1b[2m" + s + "\x1b[0m";

const greenBg = (s: string) => "\x1b[1m\x1b[42m\x1b[30m" + s + "\x1b[0m";
const redBg = (s: string) => "\x1b[1m\x1b[41m\x1b[30m" + s + "\x1b[0m";

export const color = { red, green, bold, dim };

export const icon = {
  fail: color.red.bold("✗"),
  pass: color.green.bold("✓"),
};

const createStatus =
  (prefix: string) =>
  (name: string, ...rest: (string | undefined)[]) =>
    [prefix, color.bold(name), color.dim(rest.filter(Boolean).join(" "))]
      .filter(Boolean)
      .join(" ");

export const status = {
  fail: createStatus(icon.fail),
  pass: createStatus(icon.pass),
};

export interface TestLog {
  pass: boolean;
  name: string;
  message?: string;
  detail?: string | string[];
}

export interface TestLogger {
  print(): void;
}

const length = (s: string) => s.replace(/\u001b\[\d+m/g, "").length;

export const stringifyTestLog = (log: TestLog) => {
  const name = status[log.pass ? "pass" : "fail"](log.name, log.message);
  if (!log.detail) return name;
  return [
    name,
    ...(Array.isArray(log.detail) ? log.detail.join("\n") : log.detail)
      .split(/\r?\n/)
      .map((d) => `  ${d}`),
  ].join("\n");
};

const normalizeLog = (logs: TestLog[], options: TestOptions) => {
  // const pass = logs.every((l) => l.pass);
  let pass = true,
    lines: string[] = [];

  logs.forEach((log) => {
    if (!log.pass) pass = false;
    lines.push(stringifyTestLog(log));
  });

  const name = bold(dim("test:")) + bold(options.name),
    title = (
      pass
        ? [greenBg(" PASS "), name, options.pass && color.dim(options.pass)]
        : [redBg(" FAIL "), name, options.fail && color.dim(options.fail)]
    )
      .filter(Boolean)
      .join(" ");

  return {
    pass,
    log: [title, ...lines].join("\n"),
  };
};

export const createTestLogger = (
  // name: string,
  options: TestOptions,
  ...testLogs: TestLog[]
): TestLogger => {
  const { pass, log } = normalizeLog(testLogs, options),
    output = (pass ? console.log : console.error).bind(console);
  return {
    print: () => output(log),
  };
};

// export const defineTest = (
//   test: () => Promise<TestLog | TestLog[]> | TestLog | TestLog[],
//   defaultConfig?: TestLoggerConfig | ((allPassed: boolean) => TestLoggerConfig)
// ) => {
//    return ():
// };

interface TestOptions {
  name: string;
  spinner: string;
  pass?: string;
  fail?: string;
}

export function defineTest(
  test: () => Promise<TestLog | TestLog[]>,
  options: TestOptions
): () => Promise<TestLogger>;
export function defineTest(
  test: () => TestLog | TestLog[],
  options: TestOptions
): () => TestLogger;
export function defineTest(
  test: () => Promise<TestLog | TestLog[]> | TestLog | TestLog[],
  options: TestOptions
): () => Promise<TestLogger> | TestLogger {
  const toLogger = (result: TestLog | TestLog[]): TestLogger => {
    return createTestLogger(
      options,
      ...(Array.isArray(result) ? result : [result])
    );
  };

  return () => {
    // const
    const spinner = ora({
      text: options.spinner,
      color: "green",
    }).start();

    const t1 = setTimeout(() => {
        spinner.color = "yellow";
      }, 1500),
      t2 = setTimeout(() => {
        spinner.color = "red";
      }, 5000);

    const done = () => {
      clearTimeout(t1);
      clearTimeout(t2);
      spinner.stop();
      spinner.clear();
    };

    const result = test();
    if (result instanceof Promise)
      return result.then((r) => {
        done();
        return toLogger(r);
      });
    done();
    return toLogger(result);
  };
}
