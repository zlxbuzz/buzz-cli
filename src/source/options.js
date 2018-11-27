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
  //html名称
  indexName: "index.html",
  //公共public
  publicPath: "/",
  //alias
  alias: {},
  externals: {},
  //移动端相关的优化
  mobile: {
    "1px": false, //加载1px的插件
    viewport: false, //px自动转换成vw
    rem: false //px自动转换成rem
  },
  dev: {
    //常用的环境变量
    env: {},
    //代理
    proxyTable: {}
  },
  build: {
    env: {},
    //clean配置
    cleanPath:[]
  },
  // whether to use eslint-loader
  lintOnSave: true
};
