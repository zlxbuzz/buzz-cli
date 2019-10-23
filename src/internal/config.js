export default () => {
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
