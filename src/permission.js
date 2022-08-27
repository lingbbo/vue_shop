import router from './router'
// import { Message } from 'element-ui'
import Home from '@/views/Home.vue'
// const _import = require('./router/_import_' + process.env.NODE_ENV) // Layout 是架构组件，不在后台返回，在文件里单独引入
// 动态组件不支持懒加载
// const _import = file => import('@/views/' + file + '.vue').default
const _import = file => require('@/views/' + file + '.vue').default

var getRouter // 用来获取后台拿到的路由

// 假装fakeRouter是通过后台接口请求回来的数据
const fakeRouter = {
  router: [{
    path: '', // 这里 path 必须是''
    component: 'Home',
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: 'welcome',
        meta: {
          title: '首页',
          icon: 'dashboard'
        }
      },
      {
        name: 'user',
        path: '/users',
        component: 'user/index'
      },
      {
        name: 'roles',
        path: '/roles',
        component: 'power/roles'
      },
      {
        name: 'rights',
        path: '/rights',
        component: 'power/rights'
      },
      {
        name: 'goods',
        path: '/goods',
        component: 'goods/index'
      },
      {
        name: 'goodsInfo',
        path: '/goods/add',
        component: 'goods/goodsInfo'
      },
      {
        name: 'params',
        path: '/params',
        component: 'goods/params'
      },
      {
        name: 'categories',
        path: '/categories',
        component: 'goods/categories'
      },
      {
        name: 'order',
        path: '/orders',
        component: 'order/index'
      },
      {
        name: 'report',
        path: '/reports',
        component: 'report/index'
      }]
  }
  ]

}
// 动态路由核心
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = localStorage.getItem('token')
  console.log(getRouter)
  if (!tokenStr) {
    return next('/login')
  } else {
    if (!getRouter) { // 不加这个判断，路由会陷入死循环
      if (!getObjArr('router')) {
        console.log('beforeEach  getRouter')
        getRouter = fakeRouter.router // 假装模拟后台请求得到的路由数据
        saveObjArr('router', getRouter) // 存储路由到localStorage
        routerGo(to, next) // 执行路由跳转方法
      } else { // 从localStorage拿到了路由
        getRouter = getObjArr('router') // 拿到路由
        console.log(getRouter)
        routerGo(to, next)
      }
    } else {
      next()
    }
  }
})

function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) // 过滤路由
  router.addRoutes(getRouter) // 动态添加路由
  global.antRouter = getRouter // 将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}
function saveObjArr(name, data) { // localStorage 存储数组对象的方法
  localStorage.setItem(name, JSON.stringify(data))
}
function getObjArr(name) { // localStorage 获取数组对象的方法
  return JSON.parse(localStorage.getItem(name))
}
function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Home') { // Layout组件特殊处理
        route.component = Home
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
