import * as config from "./common";
import webpack from "webpack";
import path from "path";

const appDir = file => {
  return path.resolve(process.cwd(), file || "");
};

export const getConfig = opt => {
  const webpackConfig = {
    mode: opt.mode,
    devtool: "source-map",
    entry: config.entry(opt),
    output: config.output(opt),
    externals: opt.externals,
    resolve: config.resolve(opt),
    resolveLoader: config.resolveLoader,
    optimization: {
      minimizer: [],
      moduleIds: "hashed", //和namedModules类似，默认module都有自增的id，改成hash形式,lib/WebpackOptionsApply.js
      //分割chunks
      splitChunks: config.splitChunks,
      runtimeChunk: false
    },
    module: {
      rules: config.rules(opt)
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin(opt.dev.env)
    ].concat(config.plugins(opt))
  };
  return webpackConfig;
};
