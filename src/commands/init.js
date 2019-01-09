import { spinner } from "../utils/log";
import { getConfig, generate } from "../internal/generator";

export const command = "init";
export const desc = "-- 初始化项目模版";
export const handler = async argv => {
  // 获取数据
  const inputConfig = await getConfig();

  // 初始化项目
  await spinner("项目初始化...", async spinner => {
    await generate(spinner, inputConfig);
  });
};
