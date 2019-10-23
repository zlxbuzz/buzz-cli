import Buzz from "../internal/buzz";
import errorHandler from "../utils/errorHandler";
import chalk from "chalk";

export const command = "serve";
export const aliases = ["s"];
export const desc = "webpack-dev-server开发";
export const handler = async argv => {
  const urls = await Buzz({ mode: "development" })
    .server()
    .catch(errorHandler);
  console.log(
    chalk.green(
      [
        `app running at:`,
        ` - local:   ${chalk.cyan(urls.localUrlForTerminal)}`,
        ` - network: ${chalk.cyan(urls.lanUrlForTerminal)}`
      ].join("\n")
    )
  );
};
