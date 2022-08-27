import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/404',
    component: () => import('@/views/404')
  }
]
// var constantRouterMap = []
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: routes,
  scrollBehavior: () => {
    history.pushState(null, null, document.URL)
  }
})

export default router
