import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'
import '@/utils'
import './permission'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios拦截请求，添加token
axios.interceptors.request.use((config) => {
  Nprogress.set(1.0)
  Nprogress.start()
  config.headers.Authorization = localStorage.getItem('token')
  return config
})

axios.interceptors.response.use((config) => {
  Nprogress.done()
  return config
})
Vue.use(ElementUI)
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
// treeTable组件
Vue.component('tree-table', TreeTable)
Vue.prototype.$http = axios

Vue.config.productionTip = false

window.addEventListener('popstate', function() {
  history.pushState(null, null, document.URL)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
