import Builder from "../internal/builder";
import errorHandler from "../utils/errorHandler";

export const command = "build";
export const aliases = ["b"];
export const desc = "构建应用";
export const handler = async () => {
  await Builder()
    .run()
    .catch(errorHandler);
};
