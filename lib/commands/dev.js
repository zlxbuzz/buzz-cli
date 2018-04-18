const Webpack = require('webpack')
const prepareURLs = require('../utils/prepareURLs')
const chalk = require('chalk')
const ready = require('../utils/ready')

const devOptions = {
  overlay: true,//错误展示在浏览器
  hot: true,
  host: '0.0.0.0',//保证nginx可以代理hmr
  stats: {
    colors: true,
    logLevel: 'silent',
    warnings: false,
    chunks: false,
    children: false,
    modules: false,
  }
}



async function server () {
  //初始化
  await ready()
  //avoid webpack compiler twice time
  const WebpackDevServer = require('webpack-dev-server')
  const WebpackConfig = require('../webpack/config/webpack.config.js')

  //启动webpack
  const config = WebpackConfig()
  //hot hmr 入口定义,在devOptions中必须定义host
  WebpackDevServer.addDevServerEntrypoints(config,devOptions)

  const compiler = Webpack(config)
  const Server = new WebpackDevServer(compiler,devOptions)

  let isIn = false

  const urls = prepareURLs(
    'http',
    '0.0.0.0',
    8080
  )

  Server.listen(8080);

  compiler.plugin('done', stats => {
    if(isIn) return
    isIn = true

    console.log([
      `  App running at:`,
      `  - Local:   ${chalk.cyan(urls.localUrlForTerminal)}`,
      `  - Network: ${chalk.cyan(urls.lanUrlForTerminal)}`
    ].join('\n'))
    console.log()
  })
}


module.exports = {
  command : 'dev',
  desc : '--开发模式',
  handler : server
}
