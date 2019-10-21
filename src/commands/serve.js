import Server from "../internal/server";
import errorHandler from "../utils/errorHandler";

export const command = "serve";
export const aliases = ["s"];
export const desc = "开发";
export const handler = async () => {
  await Server()
    .run()
    .catch(errorHandler);
};
