import Eos from 'eosjs'
import Timeout from 'await-timeout'
import configFile from '../../statics/config.json'

const eosConfig = {
  chainId: configFile.network.chainId,
  expireInSeconds: 60,
  broadcast: true,
  debug: false,
  sign: true
}

async function scatterNetwork(state) {
  let pp
  if (state.endpoints[state.activeEndpointIndex].httpEndpoint.split(':')[0].replace(/\//g, '') === 'https') {
    pp = 443
  } else if (state.endpoints[state.activeEndpointIndex].httpEndpoint.split(':')[0].replace(/\//g, '') === 'http') {
    pp = 80
  } else {
    pp = null
  }
  const network = await {
    blockchain: 'eos',
    chainId : configFile.network.chainId,
    protocol: state.endpoints[state.activeEndpointIndex].httpEndpoint.split(':')[0].replace(/\//g, ''),
    host: state.endpoints[state.activeEndpointIndex].httpEndpoint.split(':')[1].replace(/\//g, ''),
    port: state.endpoints[state.activeEndpointIndex].httpEndpoint.split(':')[2] || pp
  }
  return network
}

function apiDown(e,c,s) {
  if (e && e.message) {
    if(e.message === 'Failed to fetch') {
      c('NOTIFY',{
        icon: 'error',
        color: 'warning',
        message: 'Connection to endpoint is unreliable or unavailable',
        details: 'Go to Settings to setup a working API Endpoint',
        textColor: 'black',
        autoclose: 8
      })
      c('SET_CURRENT_CONNECTION_STATUS', true)
    }
  }
}

export async function memberreg({
  state,
  rootState,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    eosConfig.keyProvider = rootState.account.pkeysArray
    let eos = Eos(eosConfig)
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })
      eos = state.scatter.eos(network, Eos, eosConfig)
    }
    const contract = await eos.contract(configFile.network.tokenContract.name)
    const res = await contract.memberreg(payload.data)
    return res
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function memberunreg({
  state,
  rootState,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    eosConfig.keyProvider = rootState.account.pkeysArray
    let eos = Eos(eosConfig)
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })
      eos = state.scatter.eos(network, Eos, eosConfig)
    }
    const contract = await eos.contract(configFile.network.tokenContract.name)
    const res = await contract.memberunreg(payload.data)
    return res
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getActionHistory({
  state,
  rootState,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const history = await eos.getActions(/*rootState.account.info.account_name*/ 'pxneosincome', payload.pos, payload.offset)
    if (history && history.actions) {
      return history.actions
    } else {
      throw 'unavailable'
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function transfer({
  state,
  rootState,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    eosConfig.keyProvider = rootState.account.pkeysArray
    let eos = Eos(eosConfig)
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })
      eos = state.scatter.eos(network, Eos, eosConfig)
    }
    const contract = await eos.contract(configFile.network.tokenContract.name)
    const res = await contract.transfer(payload.data)
    return res
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function transferMain({
  state,
  rootState,
  commit
}, payload) {

  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    eosConfig.keyProvider = rootState.account.pkeysArray
    let eos = Eos(eosConfig)
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })
      eos = state.scatter.eos(network, Eos, eosConfig)
    }
    const res = await eos.transfer(payload.data)
    return res
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

function timeOut(time) {
  return new Promise(function(resolve, reject) {
    setTimeout(reject('timeout'), time)
  })
}

export async function pingCurrentEndpoint({
  state,
  commit
}) {
  const timeout = new Timeout()
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    const eos = Eos(eosConfig)
    const sTime = Date.now()
    const timer = timeout.set(state.connectionTimeoutMilSec, 'timeout')
    const ginfo = eos.getInfo({})
    const info = await Promise.race([ginfo, timer])
    const ping = Math.floor((Date.now() - sTime) / 1000)
    const utcD = new Date().toISOString().slice(0, -5)
    if (info.chain_id !== configFile.network.chainId) {
      throw Error('Wrong chainId')
    }
    if (new Date(info.head_block_time).getTime() + 10000 > new Date(utcD).getTime()) {
      commit('SET_CURRENT_CONNECTION_STATUS', true)
    } else {
      commit('SET_CURRENT_CONNECTION_STATUS', false)
    }
    return info
  } catch (error) {
    clearTimeout(timeout)
    commit('SET_CURRENT_CONNECTION_STATUS', false)
    throw error
  } finally {
    timeout.clear()
  }
}

export async function testEndpoint({
  state,
  commit
}, url) {
  const timeout = new Timeout()
  try {
    eosConfig.httpEndpoint = url
    const eos = Eos(eosConfig)
    const sTime = Date.now()
    const timer = timeout.set(state.connectionTimeoutMilSec, 'timeout')
    const ginfo = eos.getInfo({})
    const info = await Promise.race([ginfo, timer])
    if (info.chain_id !== configFile.network.chainId) {
      throw Error('Wrong chainId')
    }
    return info
  } catch (error) {
    throw error
  } finally {
    timeout.clear()
  }
}

export async function getRegistered({
  state,
  commit,
  rootState
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const members = await eos.getTableRows({
      json: true,
      scope: configFile.network.tokenContract.name,
      code: configFile.network.tokenContract.name,
      table: 'members',
      lower_bound: rootState.account.info.account_name,
      limit:1
    })
    if (!members.rows.length) {
      return false
    } else {
      if (members.rows[0].sender === rootState.account.info.account_name) {
        commit('account/ADD_REGISTRATION', members.rows[0].agreedterms, {root: true})
        return members.rows[0]
      } else {
        return false
      }
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getCustodians({
  state,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const custodians = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'candidates'
    })
    if (!custodians.rows.length) {
      return false
    } else {
      return custodians.rows
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getMemberTerms({
  state,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const memberterms = await eos.getTableRows({
      json: true,
      scope: configFile.network.tokenContract.name,
      code: configFile.network.tokenContract.name,
      table: 'memberterms'
    })
    commit('account/ADD_MEMBER_TERMS', memberterms.rows[memberterms.rows.length - 1], {root: true})
    return memberterms.rows[memberterms.rows.length - 1]
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getContractRicardian({
  state,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const contract = await eos.contract(payload)
    let ricardian = contract.fc.abi.actions
    if (ricardian) {
      commit('ADD_CONTRACT_RICARDIAN', {
        ricardian: ricardian,
        contract: payload
      })
      return ricardian
    } else {
      throw 'no_ricardian'
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getTokenContractBalance({
  state,
  rootState,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const balances = await eos.getCurrencyBalance(configFile.network.tokenContract.name, rootState.account.info.account_name, configFile.network.tokenContract.token)
    let balance
    if (balances[0]) {
      balance = parseFloat(balances[0])
    } else {
      balance = 0
    }
    commit('account/UPDATE_TOKEN_BALANCE', balance, {
      root: true
    })
    return balance
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getMainCurrencyBalance({
  state,
  rootState,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const balances = await eos.getCurrencyBalance(configFile.network.mainCurrencyContract.name, rootState.account.info.account_name, configFile.network.mainCurrencyContract.token)
    let balance
    if (balances[0]) {
      balance = parseFloat(balances[0])
    } else {
      balance = 0
    }
    commit('account/UPDATE_MAIN_CURRENCY_BALANCE', balance, {
      root: true
    })
    return balance
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function updateAccountInfo({
  state,
  rootState,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const account = await eos.getAccount({
      account_name: rootState.account.info.account_name
    })
    commit('account/UPDATE_ACCOUNT_INFO', account, {
      root: true
    })
    return account
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getAccount({
  state,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const account = await eos.getAccount({
      account_name: payload.account_name
    })
    return account
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}
