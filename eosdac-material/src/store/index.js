import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import account from './account'
import api from './api'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    account,
    api
  },
  plugins: [createPersistedState({
    key: 'account',
    paths: [
      'account.imported',
      //'account.registered',
      'account.useScatter',
      //'account.info',
      'account.pkeys',
      'account.lastUnlock',
      'account.autolock',
      'account.autolockIntervalSec',
      'account.proposalDraft'
    ],
    storage: {
      getItem: key => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
      removeItem: key => window.localStorage.removeItem(key)
    }
  }), createPersistedState({
    key: 'api',
    paths: [
      'api.activeEndpointIndex',
      'api.checkIntervalMilSec',
      'api.connectionTimeoutMilSec',
      'api.endpoints',
      //'api.lastGetInfo'
    ]
  })]
})

export default store
