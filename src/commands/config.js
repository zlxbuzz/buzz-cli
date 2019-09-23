// import { genConfig } from "../internal/generator";
export const command = "config";
export const desc = "-- 初始化相关配置";
export const handler = async () => {
  await genConfig();
};
