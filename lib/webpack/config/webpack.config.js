const htmlPlugin = require('html-webpack-plugin')
const { resolve , join } = require('path')
const vueLoader = require('../vueLoader.js')
const babelPreset = require('../babelPreset.js')
const progressBarPlugin = require('progress-bar-webpack-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const webpack = require('webpack')


const { getFiles , getPlugins }  = require('./env.js')
const styleLoader = require('../styleLoader.js')

// const { options } = require(resolve(process.cwd(),'vue.config.js'))

module.exports = (options,isProduction)=>{
  const filename = getFiles(isProduction)

  this.options = {
    entry: 'index.js'
  }

  Object.assign(this.options )

  const config = {
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
      app: resolve(process.cwd(),'.temp',this.options.entry)
    },
    output: {
      path: resolve(process.cwd(), 'dist'),
      filename: filename.js,
      chunkFilename: filename.chunk,
      publicPath: './'
    },
    resolve: {
      modules:[resolve(__dirname,'../../../node_modules'),'node_modules'],
      extensions: ['.js', '.json', '.vue'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '~': resolve(process.cwd(), 'src')
      }
    },
    resolveLoader:{
      modules:[resolve(__dirname,'../../../node_modules'),'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          use: [{
            loader: 'vue-loader',
            options: vueLoader(isProduction)
          }],
        },
        {
          test: /\.pug$/,
          use: [{
            loader: 'pug-loader',
          }],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: babelPreset
            }
          }],
        },
        // css-loader 让js识别css文件，style-loader让css嵌入到style标签中
        { test: /\.css$/ , use: styleLoader('css',isProduction)},
        { test: /\.less$/ , use: styleLoader('less',isProduction)},
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 1000, // 1KO
              name: filename.images
            }
          }]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 1000, // 1 KO
              name: filename.fonts
            }
          }]
        },
      ]
    },
    plugins: [
      new htmlPlugin({
        title: 'simple',
        filename: `index.html`,
        template: resolve(__dirname,'../../app/index.pug'),
        minify:{
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        },
        inject: true,
        ...options
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',// 指定公共 bundle 的名字。
        minChunks (module) {
          // any required modules inside node_modules are extracted to vendor
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.indexOf(`node_modules`) > -1
          )
        }
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',// 指定公共 bundle 的名字。
      //   minChunks: Infinity
      // }),
      new progressBarPlugin({
        clear: true
      }),
      new friendlyErrorsWebpackPlugin({
        clearConsole: true,
      })
    ].concat(getPlugins(isProduction))

    //如果以node api启动webpackdevserver 该选项失效
    // devServer:{
    //   contentBase: join(__dirname, "dist"),
    //   port: 9000
    // },
  }
  return config
}
