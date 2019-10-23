import webpacker from "./webpack";
import webpack from "webpack";
import webpackDevServer from "webpack-dev-server";
import defaultConfig from "./config";
import portfinder from "portfinder";
import prepareURLs from "../utils/prepareURLs";
import { appDir } from "../utils/path";
import fse from "fs-extra";
import chalk from "chalk";

const command = process.argv[2] || "build";

class Buzz {
  constructor({ mode }) {
    // 模式
    this.mode = mode || "production";
    // 钩子
    this.hooks = { [command]: {} };
    // 通用config
    this.config = {};
    // webpack相关配置
    this.webpack = {
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
  async watch({ outputDir, domain }) {
    this.config.outputDir = outputDir;
    this.config.watch = true;

    const config = webpacker(this.config).getConfig();
    const compiler = webpack(config);
    const watching = compiler.watch({}, (err, stats) => {
      console.log(stats.toString(this.webpack.stats));
      console.log(chalk.green([`app running at:`, ` - network: ${chalk.cyan(domain)}`].join("\n")));
    });
  }
  async build() {
    await this.ready();
    const config = webpacker(this.config).getConfig();

    webpack(config, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stats.toString(this.webpack.stats));
    });

    if (!this.config.watch) {
      if (typeof this.hooks[command].after === "function") {
        await this.hooks[command].after.bind(this)();
      }
    }
  }
  async server() {
    const serverOptions = {
      noInfo: true, // devserver信息
      overlay: true, //错误展示在浏览器
      hot: true, // hot reload
      compress: true, // gzip
      host: "0.0.0.0", //保证nginx可以代理hmr
      stats: this.webpack.stats
    };
    await this.ready();

    return new Promise(async resolve => {
      const config = webpacker(this.config).getConfig();
      webpackDevServer.addDevServerEntrypoints(config, serverOptions);

      const compiler = webpack(config);
      const server = new webpackDevServer(compiler, serverOptions);
      this.freePort = await portfinder.getPortPromise();
      server.listen(this.freePort);

      compiler.hooks.done.tapPromise("anything", async () => {
        return resolve(prepareURLs("http", "0.0.0.0", this.freePort));
      });
    });
  }
  async ready() {
    await this.loadConfig();
    if (typeof this.hooks[command].before === "function") {
      await this.hooks[command].before.bind(this)();
    }
  }
  async loadConfig() {
    const defaults = defaultConfig();
    let userConfig = {};
    if (await fse.pathExists(appDir("buzz.config.js"))) {
      const conf = require(appDir("buzz.config.js"));
      userConfig.config = Object.assign(conf.config);
      userConfig.hooks = conf.hooks;
    }
    this.config = Object.assign(defaults.config, userConfig.config, { mode: this.mode });
    this.hooks = Object.assign(this.hooks, userConfig.hooks);
  }
}

export default opt => new Buzz(opt);
