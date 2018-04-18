const globby = require('globby')
const fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('./path')
const _ = require('underscore')



const generateRoute = async (isPro) =>{
  if(!isPro){
    const pagesWatcher = chokidar.watch([
      path.resolve(process.cwd(),'src/pages/**/*.vue')
    ],{
      ignoreInitial: true//忽略第一次初始化
    })


    const updateRouter = async ()=>{
      const routes = await generateRoute()
      const data = await fs.readFile(path.resolve(path.appTemplate,'router.js'),'utf-8')
      await fs.outputFileSync(path.resolve(path.appTemp,'router.js'),_.template(data)({routes: routes}))
    }

    pagesWatcher.on('add', updateRouter)
    pagesWatcher.on('unlink', updateRouter)
  }
  const routerConfig = (pages)=>{
    let p = pages.replace(/(.*)pages/,'').replace(/index\.vue$/, '/').replace(/\.vue$/, '').replace(/\/{2,}/g, '/')
    const code = `
      {
        path: '${p}',
        component: ()=>import('${path.resolve(pages)}'),
      }
    `
    return code
  }
  const pages = await globby([path.resolve('src/pages/**/*.vue')])
  const routes = pages.map(routerConfig)
  return routes
}

module.exports = generateRoute

