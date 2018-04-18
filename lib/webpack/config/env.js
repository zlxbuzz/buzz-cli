const Webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cleanWebpack = require('clean-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const { resolve } = require('path')


exports.getFiles = (isProduction) => {
  return {
    js: isProduction ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js',
    css: isProduction ? 'assets/css/[name].[contenthash:8].css' : 'assets/css/[name].css',
    images: 'assets/images/[name].[hash:8].[ext]',
    fonts: isProduction ? 'assets/fonts/[name].[hash:8].[ext]' : 'assets/fonts/[name].[ext]',
    chunk: isProduction ? 'assets/js/[name].[chunkhash:8].chunk.js' : 'assets/js/[name].chunk.js'
  }
}

exports.getPlugins = (isProduction) => {
  return isProduction ?
    [
      new ExtractTextPlugin({filename: this.getFiles(isProduction).css,allChunks: true}),
      new cleanWebpack(['dist'],{
          root : resolve(process.cwd(),"."),
          verbose : true,// Write logs to console.
      }),
      new Webpack.optimize.ModuleConcatenationPlugin(),//Scope Hoisting 减少打包体积
      // new StyleExtHtmlWebpackPlugin(),//内敛联css,必需设置html plugin的inject为false
      new PreloadWebpackPlugin(),//资源预加载
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_console: true,//删除console
          },
          mangle: {
            safari10: true
          }
        },
        parallel: true
      }),
    ] :
    [
      new Webpack.HotModuleReplacementPlugin(),
      new Webpack.NamedModulesPlugin(),//开发时候显示模块的相对路径
    ]
}
