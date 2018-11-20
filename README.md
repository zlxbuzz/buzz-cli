# buzz-cli vue+webpack4 的脚手架工具

> 基于 Vue + Webpack 工具

## 安装

```bash
# 全局安装(也可以局部安装)
npm i buzz-cli -g
# 初始化项目
mkdir demo && cd demo && buzz init
# 开发
npm start
# 构建
npm build
```

## 配置

```bash
# 默认配置，可以通过buzz.config.js来覆盖
module.exports = {
  //入口
  entryPath: "src/index.js",
  //输出目录
  outputDir: "dist",
  //静态资源目录
  assetsDir: "assets",
  //入口 html
  indexPath: "index.html",
  //公共 public
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
  }
}
```
