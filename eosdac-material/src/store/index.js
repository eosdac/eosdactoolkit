import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import api from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    account,
    api
  }
})

export default store
