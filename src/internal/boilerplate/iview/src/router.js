const routers = [
  {
    path: "/index",
    meta: {
      title: ""
    },
    component: resolve => require(["./views/index.vue"], resolve)
  },
  { path: "*", redirect: "/index" }
];
export default routers;
