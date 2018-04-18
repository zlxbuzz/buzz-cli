const fs = require('fs-extra')
const path = require('./path')
const _ = require('underscore')
const generateRoute = require('./generateRoute')

module.exports = async function ready (isPro) {
  //remove
  fs.removeSync(path.appTemp)

  let initFiles = [
    'index.js',
    'base.less',
    'router.js'
  ]
  //生成路由 并且监控
  const routes = await generateRoute(isPro)

  //write
  const res = initFiles.map(async (file)=>{
    const data = await fs.readFile(path.resolve(path.appTemplate,file),'utf-8')
    await fs.outputFileSync(path.resolve(path.appTemp,file),_.template(data)({routes: routes}))
  })
  return Promise.all(res)
}
