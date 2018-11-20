import fse from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import os from "os";
import template from "lodash.template";

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
};

const writeDir = async spinner => {
  const source = path.resolve(__dirname, "..", "source", "boilerplate");
  const dest = path.resolve(process.cwd(), "src");
  await fse.copy(source, dest);
};
const ques = spinner => {
  spinner.stop();
  const q = [
    {
      type: "input",
      message: "项目名称",
      default: path.basename(process.cwd()),
      name: "name"
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
  const { name, version, author } = await ques(spinner);
  await write("package.json", "package.json", { name, version, author }, spinner, yes);
  await write("editorconfig", ".editorconfig", {}, spinner, yes);
  await write("gitignore", ".gitignore", {}, spinner, yes);
  // await write("options.js", "buzz.config.js", {}, spinner, yes);
  await writeDir(spinner);
};
