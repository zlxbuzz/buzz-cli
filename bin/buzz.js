#!/usr/bin/env node
const { join } = require('path')

require('yargs')
  .version('1.0.1')
  .usage('$0 <cmd>')
  .commandDir(join(__dirname, '../lib', 'commands'))
  .demandCommand()
  .help()
  .argv
