# buzz-cli vue+webpack4 的脚手架工具

> 基于 Vue + Webpack 工具

## 安装

```bash
# 全局安装(也可以局部安装)
npm i buzz-cli -g
# 初始化项目
mkdir demo && cd demo && buzz init
# 开发
buzz dev
# 构建
buzz build
```

## 配置

```bash
# 默认配置，可以通过buzz.config.js来覆盖
module.exports = {

  entryPath: "src/index.js", //入口

  outputDir: "dist", //输出目录

  assetsDir: "assets", //静态资源目录
  indexName: "index.html", //html名称

  indexPath: "index.html", //入口html
  publicPath: "/", //公共public
  alias: {}, //别名
  externals: {}, //不打包script引入的文件
  htmlOptions: {}, //html模版的参数
  lint: true, //启用eslint
  mobile: {
    "1px": false, //加载1px的插件
    viewport: false, //px自动转换成vw
    rem: false //px自动转换成rem
  },
  //开发配置
  dev: {
    env: {}, //环境变量
    console: false, //开启移动端的调试
    proxyTable: {} //代理
  },
  //构建配置
  build: {
    env: {}, //环境变量

    cleanPath: [] //clean配置

  }
};
```
