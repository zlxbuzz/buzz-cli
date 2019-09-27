import webpacker from "./webpack";
import fse from "fs-extra";
import { appDir } from "../utils/path";
import defaultConfig from "./config";
class Builder {
  async run() {
    const defaults = defaultConfig();
    let options;
    if (await fse.pathExists(appDir("buzz.config.js"))) {
      options = 1;
    } else {
      options = Object.assign(defaults, { mode: "production" });
    }
    const config = webpacker(options).getConfig();
    console.log(config);
  }
}

export default () => new Builder();
