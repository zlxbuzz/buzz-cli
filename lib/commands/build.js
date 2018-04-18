const WebpackConfig = require('../webpack/config/webpack.config.js')
const Webpack = require('webpack')
const ready = require('../utils/ready')


async function build() {
  //初始化
  await ready(true)
  const config = WebpackConfig({},true)

  const compiler = Webpack(config)
  compiler.run((err, stats) => {
    if (err || stats.hasErrors()) {
      throw new Error(err)
    }

    // show stats
    console.log(stats.toString({
      chunks: false,
      children: false,
      modules: false,
      colors: true
    }))


  })
}
module.exports = {
  command : 'build',
  desc : '--打包构建 ',
  handler : build
}
