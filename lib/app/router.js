import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = [
<% routes.forEach(function (route) { %>
    <%= route %>,
<% }) %>
]

Vue.use(VueRouter)

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    // Scroll to the top by default
    let position = { x: 0, y: 0 }
    // if link has anchor,  scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


const router = new VueRouter({
  scrollBehavior,
  routes: routes
});

export default router;
