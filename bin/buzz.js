#!/usr/bin/env node

const { join } = require("path");
const { version } = require("../package.json");

const title = `\n===================== buzz  ${version} ====================\n`;

require("yargs")
  .version(version)
  .usage("$0 <cmd>")
  .commandDir(join(__dirname, "../lib", "commands"))
  .demandCommand()
  .help().argv;
