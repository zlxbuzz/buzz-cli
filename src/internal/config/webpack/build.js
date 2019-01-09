import * as config from "./common";
import webpack from "webpack";
import CleanWebpackPlugin from "clean-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import path from "path";

const appDir = file => {
  return path.resolve(process.cwd(), file || "");
};

export const getConfig = opt => {
  const webpackConfig = {
    mode: opt.mode,
    devtool: false,
    entry: opt.entry,
    output: config.output(opt),
    externals: opt.externals,
    resolve: config.resolve,
    resolveLoader: config.resolveLoader,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false
        }),
        new OptimizeCSSAssetsPlugin()
      ],
      moduleIds: "hashed", //和namedModules类似，默认module都有自增的id，改成hash形式,lib/WebpackOptionsApply.js
      //分割chunks
      splitChunks: config.splitChunks,
      runtimeChunk: true
    },
    module: {
      rules: config.rules(opt)
    },
    plugins: [
      new CleanWebpackPlugin(
        opt.build.cleanPath && opt.build.cleanPath.length ? opt.build.cleanPath : [opt.outputDir],
        {
          root: appDir(),
          verbose: false
        }
      ),
      // keep chunk ids stable so async chunks have consistent hash (#1916)
      new webpack.NamedChunksPlugin(chunk => {
        if (chunk.name) {
          return chunk.name;
        }
        const hash = require("hash-sum");
        const joinedHash = hash(Array.from(chunk.modulesIterable, m => m.id).join("_"));
        return `chunk-` + joinedHash;
      }),
      new webpack.DefinePlugin(opt.build.env)
    ].concat(config.plugins(opt))
  };
  return webpackConfig;
};
