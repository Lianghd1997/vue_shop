import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/global.css'

// 导入axios
import axios from 'axios'

// 导入tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入quillEditor 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// 需要授权的API须在请求头使用authorization字段提供token令牌
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

// 全局注册tree-grid
Vue.component('tree-table', TreeTable)

// 全局注册quillEditor
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

// 自定义事件格式的全局过滤器
Vue.filter('dateFormat', function (originValue) {
  const datetime = new Date(originValue)
  const year = datetime.getFullYear()
  const month = (datetime.getMonth() + 1 + '').padStart(2, '0')
  const date = (datetime.getDate() + '').padStart(2, '0')

  const hour = (datetime.getHours() + '').padStart(2, '0')
  const minute = (datetime.getMinutes() + '').padStart(2, '0')
  const second = (datetime.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
