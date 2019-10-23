import { appDir, cliDir, getFiles } from "../../utils/path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import babelConfig from "./babel";
import postcssConfig from "./postcss";

import VueLoaderPlugin from "vue-loader/lib/plugin";
import WebpackBar from "webpackbar";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

class Webpacker {
  constructor(opt) {
    // 通用config
    this.opt = opt;
    this.isProduction = this.opt.mode === "production";
    this.files = getFiles(this.opt.mode, this.opt.assetsDir);
    this.config = {};
  }
  getConfig() {
    this.getBaseConfig();
    this.getLoaders();
    this.getPlugins();

    // change webpack config
    if (typeof this.opt.modifyWebpackConfig === "function") {
      this.config = this.opt.modifyWebpackConfig(this.config);
    }
    return this.config;
  }
  getBaseConfig() {
    // base
    this.config.mode = this.opt.mode;
    this.config.devtool = this.isProduction ? false : "source-map";
    this.config.entry = appDir(this.opt.entryPath);
    this.config.watch = this.opt.watch;
    this.config.output = {
      path: appDir(this.opt.outputDir),
      publicPath: this.opt.publicPath,
      filename: this.files.js,
      chunkFilename: this.files.chunk,
      hashDigestLength: 6
    };

    this.config.externals = this.opt.externals;

    // resolve
    this.config.resolve = {
      modules: [appDir("node_modules"), cliDir("node_modules")],
      extensions: ["*", ".js", ".vue", ".json"],
      alias: Object.assign({
        "@": appDir("src"),
        vue$: "vue/dist/vue.esm.js"
      })
    };
    this.config.resolveLoader = {
      modules: [appDir("node_modules"), cliDir("node_modules")]
    };

    // optimization
    this.config.optimization = {
      splitChunks: {
        chunks: "all", //默认只会分割异步加载async的chunk,可以采用分割所有chunk，默认会将node_modules的依赖分割。
        cacheGroups: {
          vendors: {
            name: `vendors`,
            test: /[\\/]node_modules[\\/]/,
            chunks: "initial"
          },
          common: {
            name: `common`,
            minChunks: 2,
            chunks: "initial",
            reuseExistingChunk: true
          }
        }
      },
      moduleIds: "hashed",
      minimizer: this.isProduction
        ? [
            new UglifyJsPlugin({
              cache: true,
              parallel: true,
              sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin()
          ]
        : [],
      runtimeChunk: this.isProduction ? true : false
    };
  }
  getLoaders() {
    const rules = [
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
        },
        exclude: /node_modules/
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
          this.isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: postcssConfig()
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          this.isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: postcssConfig()
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
              name: this.files.images
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
              name: this.files.fonts
            }
          }
        ]
      }
    ];

    this.config.module = { rules };
  }
  getPlugins() {
    const plugins = [
      // clean
      new CleanWebpackPlugin({
        verbose: false
      }),
      // html
      new HtmlWebpackPlugin({
        template: appDir("src/index.html"),
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        }
      }),
      // vue-loader
      new VueLoaderPlugin(),
      // progress
      new WebpackBar()
    ];
    const proPlugins = [
      // keep chunk ids stable so async chunks have consistent hash (#1916)
      new webpack.NamedChunksPlugin(chunk => {
        if (chunk.name) {
          return chunk.name;
        }
        const hash = require("hash-sum");
        const joinedHash = hash(Array.from(chunk.modulesIterable, m => m.id).join("_"));
        return `chunk-` + joinedHash;
      }),

      // css
      new MiniCssExtractPlugin({
        filename: this.files.css
      })
    ];
    this.config.plugins = this.isProduction ? plugins.concat(proPlugins) : plugins;
  }
}
// 直接暴露出webpackde配置
export default config => new Webpacker(config);
