import defaultConfig from "../internal/config";
import { appDir } from "../utils/path";
import fse from "fs-extra";

export const loadConfig = async opt => {
  const defaults = defaultConfig();
  let options;
  if (await fse.pathExists(appDir("buzz.config.js"))) {
    options = { config: Object.assign(require(appDir("buzz.config.js")), { mode: opt.mode }) };
  } else {
    options = {
      config: Object.assign(defaults.config, { mode: opt.mode }),
      hooks: defaults.hooks
    };
  }
  return options;
};
