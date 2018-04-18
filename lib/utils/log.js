const chalk = require('chalk')

exports.log = (msg)=>{
  console.log(
    chalk.cyan(msg)
  )
}
