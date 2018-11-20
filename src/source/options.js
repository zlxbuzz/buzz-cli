//default config
module.exports = {
  //入口
  entryPath: "src/index.js",
  //资源
  entryVendor: ["vue"],
  //输出目录
  outputDir: "dist",
  //静态资源目录
  assetsDir: "assets",
  //入口html
  indexPath: "index.html",
  //公共public
  publicPath: "/",
  externals: {},
  dev: {
    //常用的环境变量
    env: {},
    //代理
    proxyTable: {}
  },
  build: {
    env: {}
  },
  // whether to use eslint-loader
  lintOnSave: true
};
