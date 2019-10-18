import Vue from 'vue'
import App from './App'
import store from './store'

import MinRequest from './utils/MinRequest'
import minRequest from './utils/api'

Vue.config.productionTip = false

App.mpType = 'app'
// 打包后改
if (process.env.NODE_ENV === 'production') {
  Vue.prototype.imgBaseUrl = 'http://39.100.129.13'
} else {
  Vue.prototype.imgBaseUrl = 'http://192.168.10.208:8099'
}
Vue.prototype.$store = store

Vue.use(MinRequest)

const app = new Vue({
  store,
  ...App,
  minRequest
})
app.$mount()
