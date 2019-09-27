import fse from "fs-extra";
import path from "path";

const configsPath = path.resolve(__dirname, "..", "boilerplate", "configs");

export const createConfig = async () => {
  await write("editorconfig", ".editorconfig", "config", quiet);
  await write("eslintjs", ".eslintrc.js", "config", quiet);
  await write("gitignore", ".gitignore", "config", quiet);
  await write("browserslistrc", ".browserslistrc", "config", quiet);
  await write("prettierrc", ".prettierrc", "config", quiet);
};

// write file
async function write(fileName, outName) {
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
