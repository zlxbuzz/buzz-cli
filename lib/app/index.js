import './base.less'
import Vue from 'vue'
import router from './router.js'


Vue.config.productionTip = false


window.onload = function(){
  new Vue({
    router,
    el: '#app',
    render : h => h('router-view')
  })
}
