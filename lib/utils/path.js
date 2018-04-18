const {resolve} = require('path')
module.exports = {
  appSrc: resolve(process.cwd(),'src'),
  appTemplate: resolve(__dirname,'..','app'),
  appTemp: resolve(process.cwd(),'.temp'),
  appBuild: resolve(process.cwd(),'dist'),
  appBuildDev: resolve(process.cwd(),'.src'),
  appPages: resolve(process.cwd(),'src/pages'),
  resolve: resolve
}
