import spinner from "../utils/spinner";
import creator from "../internal/creator";
import errorHandler from "../utils/errorHandler";

export const command = "new <name> [options]";
export const aliases = ["n"];
export const desc = "初始化新的应用";
export const handler = async argv => {
  const options = {
    dir: argv.name
  };
  // 开始创建
  await creator(options)
    .start()
    .catch(errorHandler);
};
