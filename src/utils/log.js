import logSymbols from "log-symbols";
import chalk from "chalk";
import ora from "ora";
import colors from "colors";

export const success = msg => {
  console.log(logSymbols.success, chalk.green(msg));
};
export const fail = msg => {
  console.log("\n", logSymbols.error, chalk.red(msg));
};

export async function spinner(msg, fn) {
  const oraSpinner = ora(colors.green(msg)).start();
  try {
    const result = await fn(oraSpinner);
    oraSpinner.succeed(colors.green(msg));
    return result;
  } catch (error) {
    oraSpinner.fail(colors.red(error.toString()));
    return process.exit(0);
  }
}
export default {
  success,
  fail,
  spinner
};
