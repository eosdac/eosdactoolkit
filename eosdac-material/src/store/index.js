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
    storage: {
      getItem: key => window.localStorage.getItem(key),
      setItem: (key, value) => filter(key, value), // filter removes decrypted keys so they dont end up in the localstorage
      // setItem: (key, value) => window.localStorage.setItem(key, value),
      removeItem: key => window.localStorage.removeItem(key)
    }
  })]
})
function filter (key, value) {
  if (typeof value === 'string') {
    let newVal = JSON.parse(value)
    for (let i = 0; i < newVal.account.pkeys.length; i++) {
      newVal.account.pkeys[i].privateKey = ''
    }
    window.localStorage.setItem(key, JSON.stringify(newVal))
  } else {
    window.localStorage.setItem(key, value)
  }
}

export default store
