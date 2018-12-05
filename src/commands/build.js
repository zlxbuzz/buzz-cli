import log from "../utils/log";
import { spinner } from "../utils/log";
import { initConfig, initProject } from "../utils/init";
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";

import { getConfig } from "../config";
import { getUserConfig } from "../utils/extra";

export const command = "build";
export const desc = "-- build deploy";
export const handler = async () => {
  //启动webpack
  await spinner("start webpack", async spinner => {
    return new Promise((resolve, reject) => {
      const opt = Object.assign(getUserConfig(), { mode: "production" });
      const WebpackConfig = getConfig(opt);
      const compiler = Webpack(WebpackConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
          return reject(
            stats.toString({
              chunks: false,
              children: false,
              modules: false,
              colors: true
            })
          );
        }
        console.log(
          stats.toString({
            chunks: false,
            children: false,
            modules: false,
            colors: true
          })
        );
        resolve();
      });
      compiler.hooks.done.tapPromise("anything", async () => {
        spinner.clear();
      });
    });
  });
};
