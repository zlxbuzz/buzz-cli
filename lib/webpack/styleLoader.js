const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function styleLoader(ext,isPro,isVue = false){
  //todo options
  const fallbackLoader = 'vue-style-loader'
  const use = [
    {
      loader: 'css-loader',
      options: {
        minimize: isPro ? true : false,
        sourceMap: isPro ? true : false,
      }
    },
  ]

  if(!isVue){
    use.push(
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: isPro ? true : false,
          plugins: [
            require('autoprefixer')(
            {
              browsers:  [
             'last 20 versions',
             'IE 9',
             'iOS >= 8']
            })
          ]
        }
      }
    )
  }
  if(ext !== 'css'){
    use.push({
      loader: `${ext}-loader`
    })
  }
  return isPro ? ExtractTextPlugin.extract({
       use,
       fallback: 'style-loader'
     }) : ['style-loader'].concat(use)
}
