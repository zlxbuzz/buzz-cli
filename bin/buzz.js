#!/usr/bin/env node
const { join } = require("path");
const { version } = require("../package.json");
require("yargs")
  .version(version)
  .usage("$0 <cmd>")
  .commandDir(join(__dirname, "../lib", "commands"))
  .demandCommand()
  .help().argv;
