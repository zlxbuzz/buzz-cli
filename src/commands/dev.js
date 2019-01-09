import { spinner } from "../utils/log";
import chalk from "chalk";

import { getUserConfig } from "../utils/extra";
import dev from "../internal/builder/dev";

export const command = "dev";
export const desc = "-- 开发";
export const handler = async () => {
  let urls;
  // 获取配置信息
  const opt = Object.assign(getUserConfig(), { mode: "development" });
  // 启动服务
  await spinner("webpack打包...", async () => {
    urls = await dev(opt);
  });
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
