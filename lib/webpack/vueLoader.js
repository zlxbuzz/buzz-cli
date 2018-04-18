const babelPreset = require('./babelPreset')
const styleLoader = require('./styleLoader')

module.exports = (isPro)=>{
  // postcss: [require('postcss-plugins-px2rem')()],//针对vue中的style进行px转换
  const config = {
    // extractCSS: isPro ? true : false,
    // https://vue-loader.vuejs.org/zh-cn/options.html#postcss
    postcss: [
      require('autoprefixer')(
      {
        browsers:  [
       'last 20 versions',
       'IE 9',
       'iOS >= 8']
      })
    ],
    cssSourceMap: isPro ? true : false,
    loaders: {
      //可以单独处理或者和css-loader的相同的配置，这里选择走相同的配置
      css: styleLoader('css',isPro,true),
      less: styleLoader('less',isPro,true),
      js: { loader: 'babel-loader', options: { presets: babelPreset } }
    }
  }
  return config
}
