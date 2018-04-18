const { join } = require('path')
const fs = require('fs-extra')
const logSymbols = require('log-symbols')
const chalk = require('chalk')

module.exports = {
  command : 'init [name]',

  desc : '--初始化项目',

  builder : {
    name: {
       demand: true
    }
  },

  handler : function (argv) {
    const { name } = argv
    const source   = join(__dirname, '../template')
    const dst      = join(process.cwd(),name)
    if(fs.pathExistsSync(dst)){
      console.error(logSymbols.error, chalk.red(`创建失败：${dst} 已存在`))
      return
    }
    fs.copySync(source,dst)
    console.log()
    console.log(logSymbols.success, chalk.green('项目初始化成功'))
    console.log()
    console.log(chalk.green('cd ' + name + '\nbuzz dev'))
  }
}
