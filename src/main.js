import Vue from 'vue'
import App from './App'

import MinRequest from './utils/MinRequest'
import minRequest from './utils/api'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.imgBaseUrl = 'http://192.168.10.208:8088'

Vue.use(MinRequest)

const app = new Vue({
  ...App,
  minRequest
})
app.$mount()
