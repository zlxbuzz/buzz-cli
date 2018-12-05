import fse from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import os from "os";
import template from "lodash.template";
import chalk from "chalk";

const write = async (file, name, data, spinner, yes) => {
  const sourceFilePath = path.resolve(__dirname, "../source", file);
  const destFilePath = path.resolve(process.cwd(), name);
  const content = template(fse.readFileSync(sourceFilePath, "utf-8"))(data);
  const isExists = await fse.pathExists(destFilePath);
  if (isExists && !yes) {
    spinner.stop();
    const res = await inquirer.prompt([
      {
        type: "confirm",
        name: "force",
        message: `${destFilePath}已存在，是否覆盖`
      }
    ]);
    if (res.force) {
      fse.outputFileSync(destFilePath, content);
    }
  } else {
    fse.outputFileSync(destFilePath, content);
  }
  console.log(`${chalk.green("✔ ")}${chalk.grey(`创建文件: ${chalk.grey.bold(destFilePath)}`)}`);
};

const writeDir = async (spinner, template) => {
  const source = path.resolve(__dirname, "..", "source", "boilerplate", template);
  const dest = path.resolve(process.cwd(), "src");
  await fse.copy(source, dest);
  console.log(`${chalk.green("✔ ")}${chalk.grey(`创建源码目录: ${chalk.grey.bold(dest)}`)}`);
};
const ques = spinner => {
  spinner.stop();
  const templateChoices = [
    {
      name: "默认模板",
      value: "default"
    },
    {
      name: "多页模板",
      value: "multiple"
    },
    {
      name: "h5模板",
      value: "h5"
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
    }
  ];
  return inquirer.prompt(q);
};

export const initProject = async (spinner, yes) => {
  const { name, version, author, template } = await ques(spinner);
  await writeDir(spinner, template);
  await write("package.json", "package.json", { name, version, author }, spinner, yes);
  await write("editorconfig", ".editorconfig", {}, spinner, yes);
  await write("gitignore", ".gitignore", {}, spinner, yes);
  await write("eslintjs", ".eslintrc.js", {}, spinner, yes);
  await write("options", "buzz.config.js", { template }, spinner, yes);
};
