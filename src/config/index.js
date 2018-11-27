// import options from "./options";
import path from "path";
import webpack from "webpack";
import babelConfig from "./webpack/babel-config";
import postcssConfig from "./webpack/postcss-config";
import fse from "fs-extra";

import CleanWebpackPlugin from "clean-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";

import VueLoaderPlugin from "vue-loader/lib/plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { getFiles } from "../utils/extra";

const appDir = file => {
  return path.resolve(process.cwd(), file || "");
};
const cliDir = file => {
  return path.resolve(__dirname, "../../", file || "");
};
const devPlugins = opt => {
  return [new webpack.HotModuleReplacementPlugin(), new webpack.DefinePlugin(opt.dev.env)];
};
const proPlugins = opt => {
  return [
    new CleanWebpackPlugin(opt.build.cleanPath.length ? opt.build.cleanPath : [opt.outputDir], {
      root: appDir(),
      verbose: false
    }),
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
  ];
};

export const getConfig = opt => {
  const files = getFiles(opt.mode, opt.assetsDir);
  const config = {
    mode: opt.mode,
    entry: { main: appDir(opt.entryPath) },

    devtool: opt.mode === "development" ? "source-map" : false,
    resolve: {
      modules: [appDir("node_modules"), cliDir("node_modules")],
      extensions: ["*", ".js", ".vue", ".json"],
      alias: Object.assign(
        {},
        {
          vue$: "vue/dist/vue.esm.js"
        },
        opt.alias
      )
    },
    output: {
      path: appDir(opt.outputDir),
      publicPath: opt.publicPath,
      filename: files.js,
      chunkFilename: files.chunk,
      hashDigestLength: 6
    },
    externals: opt.externals,
    resolveLoader: {
      modules: [appDir("node_modules"), cliDir("node_modules")]
    },
    optimization: {
      minimizer:
        opt.mode === "development"
          ? []
          : [
              new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: opt.mode === "development"
              }),
              new OptimizeCSSAssetsPlugin()
            ],
      moduleIds: "hashed", //和namedModules类似，默认module都有自增的id，改成hash形式,lib/WebpackOptionsApply.js
      //分割chunks
      splitChunks: {
        chunks: "all" //默认只会分割异步加载async的chunk,可以采用分割所有chunk，默认会将node_modules的依赖分割。
      },
      runtimeChunk: opt.mode === "development" ? false : true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: "babel-loader",
            options: babelConfig
          },
          exclude: /node_modules/
        },
        {
          test: /\.vue$/,
          use: {
            loader: "vue-loader"
          }
        },
        {
          test: /\.html$/,
          use: {
            loader: "html-loader"
          }
        },
        {
          test: /\.hbs$/,
          use: {
            loader: "handlebars-loader"
          }
        },
        {
          test: /\.css$/,
          use: [
            opt.mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: postcssConfig(opt)
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            opt.mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: postcssConfig(opt)
            },
            "less-loader"
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 1000, // 1KO
                name: files.images
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 1000, // 1 KO
                name: files.fonts
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: files.css
      }),
      new VueLoaderPlugin(), //将其他规则应用到vue
      new HtmlWebpackPlugin({
        filename: opt.indexName,
        template: fse.existsSync(appDir(opt.indexPath))
          ? appDir(opt.indexPath)
          : cliDir("lib/source/index.html")
      })
    ].concat(opt.mode === "development" ? devPlugins(opt) : proPlugins(opt))
  };
  return config;
};
