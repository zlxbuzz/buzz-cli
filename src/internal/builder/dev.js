import { getConfig } from "../config/webpack/dev";
import Webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import portfinder from "portfinder";
import prepareURLs from "../../utils/prepareURLs";

export default async opt => {
  return new Promise(async resolve => {
    let freePort;
    const devOptions = {
      compress: true,
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
    const config = getConfig(opt);

    WebpackDevServer.addDevServerEntrypoints(config, devOptions);
    const compiler = Webpack(config);
    const Server = new WebpackDevServer(compiler, devOptions);

    freePort = await portfinder.getPortPromise();
    Server.listen(freePort);
    compiler.hooks.done.tapPromise("anything", async () => {
      return resolve(prepareURLs("http", "0.0.0.0", freePort));
    });
  });
};
