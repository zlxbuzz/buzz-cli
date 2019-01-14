import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/index"
  }
];

function importAll(r) {
  r.keys().forEach(key => {
    routes.push({ path: key.split(".")[1], component: r(key).default });
  });
}

importAll(require.context("../views", false, /\.vue$/));
const router = new VueRouter({ routes: routes });

export default router;
