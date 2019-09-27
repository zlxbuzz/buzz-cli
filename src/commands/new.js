// import { getConfig, generate } from "../internal/generator";
import spinner from "../utils/spinner";
import creater from "../internal/create";

export const command = "new <name> [options]";
export const aliases = ["n"];
export const desc = "初始化新的应用";
export const handler = async argv => {
  // spinner.start("初始化...");
  // 选择模版
  // 初始化基础配置

  // 初始化模版
  // 安装依赖
  // git初始化

  // 获取数据
  // const inputConfig = await getConfig();
  //
  // // 初始化项目
  // const spinner = ora({ color: "green", text: "初始化..." }).start();
  // await generate(inputConfig);
  // spinner.succeed("初始化完成");

  const options = {
    dir: argv.name
  };
  // 开始创建
  await creater(options).start();
  // setTimeout(() => {
  //   spinner.succeed("初始化完成");
  // }, 3000);
};
