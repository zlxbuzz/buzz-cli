import webpacker from "./webpack";
import fse from "fs-extra";
import { appDir } from "../utils/path";
import defaultConfig from "./config";
import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import portfinder from "portfinder";
import prepareURLs from "../utils/prepareURLs";

class Server {
  constructor() {
    this.options = {
      overlay: true, //错误展示在浏览器
      hot: true,
      host: "0.0.0.0", //保证nginx可以代理hmr
      // proxy: opt.dev.proxyTable,
      stats: {
        children: false,
        performance: true,
        publicPath: true,
        timings: false,
        entrypoints: false, // 入口
        modules: false, // 模块展示
        builtAt: false, // 构建日期
        assetsSort: "size", //资源输出顺序
        assets: true, // 资源输出是否展示
        version: false, // webpack version
        chunks: false, // Makes the build much quieter
        colors: true // Shows colors in the console
      }
    };
  }
  async run() {
    const defaults = defaultConfig();
    let options;
    if (await fse.pathExists(appDir("buzz.config.js"))) {
      options = 1;
    } else {
      options = {
        config: Object.assign(defaults.config, { mode: "development" }),
        hooks: defaults.hooks
      };
    }
    const config = webpacker(options.config).getConfig();
    webpackDevServer.addDevServerEntrypoints(config, this.options);

    const compiler = webpack(config);
    const server = new webpackDevServer(compiler, this.options);
    this.freePort = await portfinder.getPortPromise();
    server.listen(this.freePort);
  }
}

export default () => new Server();
