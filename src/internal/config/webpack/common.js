import path from "path";
import fse from "fs-extra";
import { getFiles } from "../../../utils/extra";
import babelConfig from "./babel-config";
import postcssConfig from "./postcss-config";

import VueLoaderPlugin from "vue-loader/lib/plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const appDir = file => {
  return path.resolve(process.cwd(), file || "");
};
const cliDir = file => {
  return path.resolve(__dirname, "../../../../", file || "");
};
export const resolve = {
  modules: [appDir("node_modules"), cliDir("node_modules")],
  extensions: ["*", ".js", ".vue", ".json"],
  alias: {
    vue$: "vue/dist/vue.esm.js"
  }
};
export const resolveLoader = {
  modules: [appDir("node_modules"), cliDir("node_modules")]
};

export const splitChunks = {
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
};

export const output = opt => {
  const files = getFiles(opt.mode, opt.assetsDir);
  return {
    path: appDir(opt.outputDir),
    publicPath: opt.publicPath,
    filename: files.js,
    chunkFilename: files.chunk,
    hashDigestLength: 6
  };
};

export const rules = opt => {
  const files = getFiles(opt.mode, opt.assetsDir);
  return [
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
  ];
};

export const plugins = opt => {
  const files = getFiles(opt.mode, opt.assetsDir);
  return [
    new MiniCssExtractPlugin({
      filename: files.css
    }),
    new HtmlWebpackPlugin({
      ...opt.htmlOptions,
      filename: opt.indexName,
      template: fse.existsSync(appDir(opt.indexPath))
        ? appDir(opt.indexPath)
        : cliDir("lib/source/index.html")
    }),
    new VueLoaderPlugin() //将其他规则应用到vue
  ];
};
