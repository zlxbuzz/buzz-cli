import webpacker from "./webpack";
import fse from "fs-extra";
import { appDir } from "../utils/path";
import defaultConfig from "./config";
import webpack from "webpack";
class Builder {
  async run() {
    const defaults = defaultConfig();
    let options;
    if (await fse.pathExists(appDir("buzz.config.js"))) {
      options = 1;
    } else {
      options = {
        config: Object.assign(defaults.config, { mode: "production" }),
        hooks: defaults.hooks
      };
    }
    const config = webpacker(options.config).getConfig();

    webpack(config, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        stats.toString({
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
        })
      );
    });
  }
}

export default () => new Builder();
