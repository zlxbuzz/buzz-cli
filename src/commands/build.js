import { spinner } from "../utils/log";

import { getUserConfig } from "../utils/extra";
import build from "../internal/builder/build";

export const command = "build";
export const desc = "-- build deploy";
export const handler = async () => {
  // 获取配置信息
  const opt = Object.assign(getUserConfig(), { mode: "production" });
  // 启动服务
  await spinner("webpack打包...", async () => {
    await build(opt);
  });
};
