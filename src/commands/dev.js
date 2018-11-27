import log from "../utils/log";
import { spinner } from "../utils/log";
import chalk from "chalk";
import { initConfig, initProject } from "../utils/init";
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import portfinder from "portfinder";
import prepareURLs from "../utils/prepareURLs";

import { getConfig } from "../config";
import { getUserConfig } from "../utils/extra";
import defaults from "../source/options";

export const command = "dev";
export const desc = "-- start dev ";
export const handler = async () => {
  let freePort;
  let urls;
  const opt = Object.assign(getUserConfig(), defaults, { mode: "development" });
  //启动webpack
  await spinner("start webpack", async spinner => {
    return new Promise(async resolve => {
      const devOptions = {
        overlay: true, //错误展示在浏览器
        hot: true,
        host: "0.0.0.0", //保证nginx可以代理hmr
        proxy: opt.dev.proxyTable,
        stats: {
          colors: true,
          logLevel: "silent",
          chunks: false,
          children: false,
          modules: false
        }
      };
      const WebpackConfig = getConfig(opt);
      WebpackDevServer.addDevServerEntrypoints(WebpackConfig, devOptions);

      const compiler = Webpack(WebpackConfig);

      const Server = new WebpackDevServer(compiler, devOptions);

      freePort = await portfinder.getPortPromise();
      Server.listen(freePort);
      urls = prepareURLs("http", "0.0.0.0", freePort);
      compiler.hooks.done.tapPromise("anything", async () => {
        spinner.clear();
        resolve();
      });
    });
  });
  // 显示域名
  await spinner(
    [
      `app running at:`,
      ` - local:   ${chalk.cyan(urls.localUrlForTerminal)}${opt.indexName}`,
      ` - network: ${chalk.cyan(urls.lanUrlForTerminal)}${opt.indexName}`
    ].join("\n"),
    async () => {}
  );
};
