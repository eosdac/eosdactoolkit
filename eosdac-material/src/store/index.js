import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import account from './account'
import api from './api'
import usersettings from './usersettings'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    account,
    api,
    usersettings
  },
  plugins: [createPersistedState({
    key: 'account',
    paths: [
      'account.imported',
      'account.useScatter',
      'account.pkeys',
      'account.lastUnlock',
      'account.autolock',
      'account.autolockIntervalSec',
      'account.proposalDraft',
      'account.firstReg'
    ],
    //filter: mutation => (mutation.payload.save)? true : false
  }), createPersistedState({
    key: 'api',
    paths: [
      'api.chainId',
      'api.activeEndpointIndex',
      'api.checkIntervalMilSec',
      'api.connectionTimeoutMilSec',
      'api.endpoints'
    ],
    //filter: mutation => (mutation.payload.save)? true : false
    //filter: mutation => console.log(mutation)
  }), createPersistedState({
    key: 'usersettings',
    paths: [
      'usersettings.language',
      'usersettings.transactionPopup'
    ],
    //filter: mutation => (mutation.payload.save)? true : false
  })]
})

export default store
