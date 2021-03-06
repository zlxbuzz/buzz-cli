# buzz-cli vue+webpack4 的脚手架工具

> 基于 Vue + Webpack 工具

## 安装

```bash
# 全局安装(也可以局部安装)
npm i buzz-cli -g
```

# 初始化项目

```bash
buzz new demo

```

# 开发

```bash
buzz serve

```

# 构建

```bash

buzz build

```

## 配置

```bash
# 默认配置，可以通过buzz.config.js来覆盖
module.exports = {
  // webpack相关的配置的默认值
  const config = {
    // 项目入口
    entryPath: "./src/index.js",

    // 输出目录
    outputDir: "dist",

    // 静态资源目录
    assetsDir: "assets",

    // 生成的html名称
    htmlName: "index.html",

    // 公共路径
    publicPath: "/"
  };

  // 构建过程中的钩子,包含before和after
  const hooks = {};
  return {
    config,
    hooks
  };
};
```
