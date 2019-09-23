// import { getConfig, generate } from "../internal/generator";
// import ora from "ora";

export const command = "init";
export const desc = "-- 初始化项目模版";
export const handler = async argv => {
  // 获取数据
  const inputConfig = await getConfig();

  // 初始化项目
  const spinner = ora({ color: "green", text: "初始化..." }).start();
  await generate(inputConfig);
  spinner.succeed("初始化完成");
};
