import { appDir, cliDir, getFiles } from "../../utils/path";
class Webpacker {
  constructor(opt) {
    this.opt = opt;
    this.config = {};
  }
  getConfig() {
    this.getBaseConfig();
    return this.config;
  }
  getBaseConfig() {
    const files = getFiles(this.opt.mode);

    this.config.mode = this.opt.mode;
    this.config.devtool = false;
    this.config.entry = appDir(this.opt.entryPath);
    this.config.output = {
      path: appDir(this.opt.outputDir),
      publicPath: this.opt.publicPath,
      filename: files.js,
      chunkFilename: files.chunk,
      hashDigestLength: 6
    };
    this.config.externals = this.opt.externals;
    this.config.resolve = {
      modules: [appDir("node_modules"), cliDir("node_modules")],
      extensions: ["*", ".js", ".vue", ".json"],
      alias: Object.assign({
        "@": appDir("src"),
        vue$: "vue/dist/vue.esm.js"
      })
    };
    this.config.resolveLoader = {
      modules: [appDir("node_modules"), cliDir("node_modules")]
    };
  }
  getLoaders() {}
  getPlugins() {}
}
export default opt => new Webpacker(opt);
