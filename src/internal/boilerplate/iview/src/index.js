import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import router from "./router/index";
import iView from "iview";
import "iview/dist/styles/iview.css";
import "@/assets/index.less";

Vue.use(VueRouter);
Vue.use(iView);

new Vue({
  el: "app",
  router,
  render: h => h(App)
});
