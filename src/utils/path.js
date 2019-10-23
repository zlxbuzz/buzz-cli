import path from "path";

// 应用路径
export const appDir = (...file) => {
  return path.resolve(process.cwd(), ...file);
};
// cli路径
export const cliDir = (...file) => {
  return path.resolve(__dirname, "..", "..", ...file);
};
// 文件输出
export const getFiles = (mode, assets) => {
  const isProduction = mode === "production";
  return {
    js: isProduction ? `${assets}/js/[name].[chunkhash].js` : `${assets}/js/[name].js`,
    css: isProduction ? `${assets}/css/[name].[contenthash].css` : `${assets}/css/[name].css`,
    images: `${assets}/img/[name].[hash].[ext]`,
    fonts: isProduction ? `${assets}/fonts/[name].[hash].[ext]` : `${assets}/fonts/[name].[ext]`,
    chunk: isProduction
      ? `${assets}/js/[name].[chunkhash].chunk.js`
      : `${assets}/js/[name].chunk.js`
  };
};
