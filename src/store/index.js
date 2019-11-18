import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    hasLogin: false,
    company: {}
  },
  mutations: {
    setCom(state, provider) {
      state.company.tel = provider.tel
      state.company.name = provider.name
      uni.setStorage({
        key: 'company',
        data: provider
      })
    },
    login(state, provider) {
      state.hasLogin = true
      state.userInfo.sessionId = provider.sessionId
      state.userInfo.phoneNum = provider.phoneNum
      uni.setStorage({
        key: 'userInfo',
        data: provider
      })
    },
    logout(state) {
      state.hasLogin = false
      state.userInfo = {}
      uni.removeStorage({
        key: 'userInfo'
      })
    }
  }
})

export default store
