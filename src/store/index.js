import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		uerInfo: {},
		hasLogin: false
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true
			state.uerInfo.sessionId = provider.sessionId
			state.uerInfo.phoneNum = provider.phoneNum
			uni.setStorage({
				key: 'uerInfo',
				data: provider
			})
		},
		logout(state) {
			state.hasLogin = false
			state.uerInfo = {}
			uni.removeStorage({
				key: 'uerInfo'
			});
		}
	}
})

export default store
