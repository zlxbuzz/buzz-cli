#!/usr/bin/env node

console.log("Welcome to buzz cli tool");

const { join } = require("path");
const { version } = require("../package.json");
require("yargs")
  .version(version)
  .usage("$0 <cmd>")
  .commandDir(join(__dirname, "../lib", "commands"))
  .demandCommand()
  .help().argv;
