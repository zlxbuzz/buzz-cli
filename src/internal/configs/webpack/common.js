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

export const entry = opt => {
  let entrys = {};
  if (opt.pages) {
    const pages = Object.keys(opt.pages);
    pages.forEach(name => {
      entrys[name] = appDir(opt.pages[name].entry);
    });
  } else {
    entrys = appDir(opt.entryPath);
  }
  return entrys;
};

export const resolve = opt => {
  return {
    modules: [appDir("node_modules"), cliDir("node_modules")],
    extensions: ["*", ".js", ".vue", ".json"],
    alias: Object.assign(
      {
        "@": appDir("src"),
        vue$: "vue/dist/vue.esm.js"
      },
      opt.alias
    )
  };
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
  ].concat(
    opt.lint
      ? [
          {
            enforce: "pre",
            test: /\.(js|vue)$/,
            exclude: /node_modules/,
            use: {
              loader: "eslint-loader"
            }
          }
        ]
      : []
  );
};

export const plugins = opt => {
  const files = getFiles(opt.mode, opt.assetsDir);
  let html = [];
  if (opt.pages) {
    for (const name of Object.keys(opt.pages)) {
      html.push(
        new HtmlWebpackPlugin({
          filename: `${name}/${opt.indexName}`,
          chunks: ["vendors", "common", name].concat(
            opt.mode === "development" ? [] : [`runtime~${name}`]
          ),
          template: fse.existsSync(appDir(opt.indexPath))
            ? appDir(opt.indexPath)
            : cliDir("lib/source/index.html")
        })
      );
    }
  } else {
    html.push(
      new HtmlWebpackPlugin({
        ...opt.htmlOptions,
        filename: opt.indexName,
        template: fse.existsSync(appDir(opt.indexPath))
          ? appDir(opt.indexPath)
          : cliDir("lib/source/index.html")
      })
    );
  }
  return [
    new MiniCssExtractPlugin({
      filename: files.css
    }),
    new VueLoaderPlugin() //将其他规则应用到vue
  ].concat(html);
};
