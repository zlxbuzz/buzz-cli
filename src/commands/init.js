import log from "../utils/log";
import { spinner } from "../utils/log";
import { initConfig, initProject } from "../utils/init";

export const command = "init";
export const desc = "-- init project";
export const handler = async argv => {
  //目录初始化
  await spinner("项目创建完成", async spinner => {
    await initProject(spinner, argv.y);
  });
};
