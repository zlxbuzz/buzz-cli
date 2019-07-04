import path from "path";
import os from "os";
import fse from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
import template from "lodash.template";
import cp from "child_process";
import logger from "../../utils/logger";

const write = async (file, name, data, yes) => {
  let sourceFilePath;
  if (!(await fse.pathExists(path.resolve(__dirname, "../boilerplate", file)))) {
    sourceFilePath = path.resolve(__dirname, "../../source", file);
  } else {
    sourceFilePath = path.resolve(__dirname, "../boilerplate", file);
  }
  const destFilePath = path.resolve(process.cwd(), name);
  const content = template(fse.readFileSync(sourceFilePath, "utf-8"))(data);
  fse.outputFileSync(destFilePath, content);
};
const writeDir = async (template, { name, version, author }) => {
  const source = path.resolve(__dirname, "..", "boilerplate", template, "src");
  const dest = path.resolve(process.cwd(), "src");
  await fse.copy(source, dest);
  await write(`${template}/package.json`, "package.json", { name, version, author });
  if (await fse.pathExists(path.resolve(__dirname, "../boilerplate", template, "buzz.config.js"))) {
    await write(`${template}/buzz.config.js`, "buzz.config.js", { name, version, author });
  }
};

export const getConfig = () => {
  const templateChoices = [
    {
      name: "基于 Vue2 + iView3 的 web 项目",
      value: "iview"
    },
    {
      name: "基于 Vue2 的组件库",
      value: "ui"
    },
    {
      name: "基于 Vue2 的多页项目",
      value: "multiple"
    }
  ];
  const q = [
    {
      type: "input",
      message: "项目名称",
      default: path.basename(process.cwd()),
      name: "name"
    },
    {
      type: "list",
      name: "template",
      message: "请选择模版",
      choices: templateChoices
    },
    {
      type: "input",
      message: "版本号",
      default: "1.0.0",
      name: "version"
    },
    {
      type: "input",
      message: "作者",
      default: os.userInfo().username,
      name: "author"
    },
    {
      type: "confirm",
      message: "是否需要安装依赖(yarn)",
      name: "needyarn"
    }
  ];
  return inquirer.prompt(q);
};

export const generate = async ({ name, version, author, template, needyarn }) => {
  await writeDir(template, { name, version, author });
  await genConfig(true);
  if (needyarn) {
    return new Promise(resolve => {
      cp.exec("yarn", (err, std) => {
        resolve();
      });
    });
  }
};

async function mv(source, dest, cwd = "", quiet) {
  const sourceFile = path.resolve(__dirname, "..", "..", "source", cwd, source);
  const destFile = path.resolve(process.cwd(), dest);

  const isExists = await fse.pathExists(destFile);
  if (isExists && !quiet) {
    const res = await inquirer.prompt([
      {
        type: "confirm",
        name: "force",
        message: `${destFile}已存在，是否覆盖`
      }
    ]);
    if (res.force) {
      await fse.copy(sourceFile, destFile);
      logger.done(`更新成功: ${destFile}`);
    }
  } else {
    await fse.copy(sourceFile, destFile);
  }
}

export const genConfig = async (quiet = false) => {
  await mv("editorconfig", ".editorconfig", "config", quiet);
  await mv("eslintjs", ".eslintrc.js", "config", quiet);
  await mv("gitignore", ".gitignore", "config", quiet);
  await mv("browserslistrc", ".browserslistrc", "config", quiet);
  await mv("prettierrc", ".prettierrc", "config", quiet);
};
