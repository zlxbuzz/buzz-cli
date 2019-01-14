import path from "path";
import os from "os";
import fse from "fs-extra";
import inquirer from "inquirer";
import chalk from "chalk";
import template from "lodash.template";
import cp from "child_process";
import { spinnerLoading } from "../../utils/log";

const write = async (file, name, data, spinner, yes) => {
  let sourceFilePath;
  if (!(await fse.pathExists(path.resolve(__dirname, "../boilerplate", file)))) {
    sourceFilePath = path.resolve(__dirname, "../../source", file);
  } else {
    sourceFilePath = path.resolve(__dirname, "../boilerplate", file);
  }
  const destFilePath = path.resolve(process.cwd(), name);
  const content = template(fse.readFileSync(sourceFilePath, "utf-8"))(data);
  // const isExists = await fse.pathExists(destFilePath);
  // if (isExists && !yes) {
  //   spinner.stop();
  //   const res = await inquirer.prompt([
  //     {
  //       type: "confirm",
  //       name: "force",
  //       message: `${destFilePath}已存在，是否覆盖`
  //     }
  //   ]);
  //   if (res.force) {
  //     fse.outputFileSync(destFilePath, content);
  //   }
  // } else {
  //   fse.outputFileSync(destFilePath, content);
  // }
  fse.outputFileSync(destFilePath, content);
  spinnerLoading(spinner, `创建文件: ${chalk.grey.bold(destFilePath)}`);
};
const writeDir = async (spinner, template, { name, version, author }) => {
  const source = path.resolve(__dirname, "..", "boilerplate", template, "src");
  const dest = path.resolve(process.cwd(), "src");
  await fse.copy(source, dest);
  spinnerLoading(spinner, `创建源码目录: ${chalk.grey.bold(dest)}`);
  await write(`${template}/package.json`, "package.json", { name, version, author }, spinner);
  if (await fse.pathExists(path.resolve(__dirname, "../boilerplate", template, "buzz.config.js"))) {
    await write(`${template}/buzz.config.js`, "buzz.config.js", { name, version, author }, spinner);
  }
};

export const getConfig = () => {
  const templateChoices = [
    {
      name: "基于 Vue2 + iView3 的 web 项目",
      value: "iview"
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

export const generate = async (spinner, { name, version, author, template, needyarn }) => {
  await writeDir(spinner, template, { name, version, author });
  await write("editorconfig", ".editorconfig", {}, spinner);
  await write("gitignore", ".gitignore", {}, spinner);
  await write("eslintjs", ".eslintrc.js", {}, spinner);
  if (needyarn) {
    return new Promise(resolve => {
      cp.exec("yarn", (err, std) => {
        spinnerLoading(spinner, std);
        resolve();
      });
    });
  }
};
