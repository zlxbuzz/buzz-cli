import path from "path";
import fs from "fs";
import log from "./log";
export const getUserConfig = () => {
  let fileConfig;
  const configPath = path.resolve(process.cwd(), "buzz.config.js");
  if (fs.existsSync(configPath)) {
    fileConfig = require(configPath);
  } else {
    fileConfig = require(path.resolve(__dirname, "..", "internal", "config", "buzz"));
  }
  return Object.assign({}, fileConfig);
};
export const getFiles = (mode, assets) => {
  const isProduction = mode === "production";
  return {
    js: isProduction ? `${assets}/js/[name].[chunkhash].js` : `${assets}/js/[name].js`,
    css: isProduction ? `${assets}/css/[name].[contenthash].css` : `${assets}/css/[name].css`,
    images: `${assets}/img/[name].[hash].[ext]`,
    fonts: isProduction ? `${assets}/fonts/[name].[hash].[ext]` : `${assets}/fonts/[name].[ext]`,
    chunk: isProduction
      ? `${assets}/js/[name].[chunkhash].chunk.js`
      : `${assets}/js/[name].chunk.js`
  };
};
