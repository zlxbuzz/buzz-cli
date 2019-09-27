import fse from "fs-extra";
import path from "path";
import logger from "../utils/logger";
import inquirer from "inquirer";

const configsPath = path.resolve(__dirname, "..", "boilerplate", "configs");
class Creater {
  constructor(opt) {
    this.opt = Object.assign({}, opt);
    this.opt.outDir = path.resolve(process.cwd(), this.opt.dir);
    this.opt.npmCli = "yarn";
  }
  async start() {
    const config = await this.prompts();
    if (config.template) {
      this.opt.template = config.template;
      await this.generator();
    }
  }
  async prompts() {
    const templateChoices = [
      {
        name: "基本页面",
        value: "multiple"
      },
      {
        name: "基于 Vue2 + iView3 的 web 项目",
        value: "iview"
      }
    ];
    const q = [
      {
        type: "list",
        name: "template",
        message: "请选择模版",
        choices: templateChoices
      }
    ];
    return inquirer.prompt(q);
  }
  async generator() {
    await fse.ensureDir(this.opt.outDir);
    await this.createApp();
    await this.generatorConfig();
  }
  async createApp() {
    const src = path.resolve(__dirname, "..", "boilerplate", "templates", this.opt.template, "src");
    const targetSrc = path.resolve(this.opt.outDir, "src");
    await fse.copy(src, targetSrc);
  }
  async generatorConfig() {
    await write.call(this, "editorconfig.template", ".editorconfig");
    await write.call(this, "browserslistrc.template", ".browserslistrc");
    await write.call(this, "eslint.js.template", ".eslintrc.js");
    await write.call(this, "gitignore.template", ".gitignore");
    await write.call(this, "prettierrc.template", ".prettierrc");
  }
}

async function write(source, target) {
  const sourceFile = path.resolve(configsPath, source);
  const targetFile = path.resolve(this.opt.outDir, target);

  await fse.copy(sourceFile, targetFile);
  logger.create(target);
}

export default opt => new Creater(opt);
