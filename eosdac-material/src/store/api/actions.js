import Eos from 'eosjs'
import Timeout from 'await-timeout'
import configFile from '../../statics/config.json'
import axios from 'axios'


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
        message: 'api.connection_to_endpoint_failed',
        details: 'api.connection_to_endpoint_failed_details',
        textColor: 'black',
        autoclose: 8
      })
      c('SET_CURRENT_CONNECTION_STATUS', false)
    }
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

export async function transaction({
rootState,
commit
}, payload) { //scatter, contract, action, data
  try {
    eosConfig.httpEndpoint = rootState.api.endpoints[rootState.api.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    if (payload.scatter) {
      const network = await scatterNetwork(rootState.api)
      const identity = await rootState.api.scatter.getIdentity({
        accounts: [network]
      })
      let authority = identity.accounts[0].authority
      let accountname = identity.accounts[0].name
      let auth = { authorization: [ accountname+'@'+authority ] }
      eos = rootState.api.scatter.eos(network, Eos, eosConfig)
      const contract = await eos.contract(payload.contract)
      const res = await contract[payload.action](payload.data, auth)
      commit('SET_CURRENT_CONNECTION_STATUS', true)
      return res
    }
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

//only use this function to check if the current logged in user is a candidate
export async function getIsCandidate({
  state,
  commit,
  rootState
}) {
  if(configFile.network.custodianContract.name ===''){
    return false;
  };
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const candidate = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'candidates',
      lower_bound: rootState.account.info.account_name,
      limit:1
    })
    if (!candidate.rows.length) {
      commit('account/SET_MEMBER_ROLES', {candidate: false}, {root: true} );
      return false;
    } else {
      if (candidate.rows[0].candidate_name === rootState.account.info.account_name && candidate.rows[0].is_active) {
        commit('account/SET_MEMBER_ROLES', {candidate: true}, {root: true} );
        return candidate.rows[0];
      } else {
        commit('account/SET_MEMBER_ROLES', {candidate: false}, {root: true} );
        if(candidate.rows[0].candidate_name === rootState.account.info.account_name){
          return candidate.rows[0];
        }
        else{
          return false;
        }
        
      }
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}
//only use this function to check if the current logged in user is a custodian
export async function getIsCustodian({
  state,
  commit,
  rootState
}) {
  if(configFile.network.custodianContract.name ===''){
    return false;
  };
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const custodian = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'custodians',
      lower_bound: rootState.account.info.account_name,
      limit:1
    })
    if (!custodian.rows.length) {
      commit('account/SET_MEMBER_ROLES', {custodian: false}, {root: true} );
      return false;
    } else {
      if (custodian.rows[0].cust_name === rootState.account.info.account_name) {
        commit('account/SET_MEMBER_ROLES', {custodian: true}, {root: true} );
        return custodian.rows[0];
      } else {
        commit('account/SET_MEMBER_ROLES', {custodian: false}, {root: true} );
        return false;
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
  commit,

}, param) {

  try {
    // console.log(param)
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const custodians = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'candidates',
      lower_bound: param.lb,
      limit:0
      // key_type: 'i64',
      // index_position:1
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

export async function getMemberVotes({
  state,
  commit,
}, param) {
  try {

    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const votes = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'votes',
      lower_bound: param.member,
      limit:1
      // key_type: 'i64',
      // index_position:1
    })
    if (!votes.rows.length) {
      return false
    } else {
      // console.log(votes.rows[0].voter +'---'+param.member)
      if(votes.rows[0].voter === param.member){
        return votes.rows
      }
      else{
        return false;
      }

    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}


export async function registerCandidate({
  state,
  rootState,
  commit
}, payload) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    eosConfig.keyProvider = rootState.account.pkeysArray
    let eos = Eos(eosConfig);
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })
      eos = state.scatter.eos(network, Eos, eosConfig);
      let authority = identity.accounts[0].authority;
      let accountname = identity.accounts[0].name;

      let transferAction = {
          account: configFile.network.tokenContract.name,
          name: 'transfer',
          authorization: [{
            actor: accountname,
            permission: authority
          }],
          data: Object.assign({from : accountname, to: configFile.network.custodianContract.name}, payload.stakedata)
      };
      
      let nominateCandAction = {
          account: configFile.network.custodianContract.name,
          name: 'nominatecand',
          authorization: [{
            actor: accountname,
            permission: authority
          }],
          data: Object.assign({cand : accountname}, payload.registerdata)
      };
      let alreadyStaked = payload.staked_enough;
      let actions = [];
      if(alreadyStaked){
        actions = [nominateCandAction];
      }
      else{
        actions = [transferAction, nominateCandAction];
      }

      let res = await eos.transaction( { actions: actions } );
      return res
      commit('SET_CURRENT_CONNECTION_STATUS', true)
    }
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
    const contract = await eos.getAbi(payload)
    let ricardian = contract.abi.actions
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
  if(rootState.account.info === null){
    return false;
  }
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

export async function getContractConfig({
  state,
  commit,
}, payload) {

  let already_in_store = state.contractConfigs.find(cc => cc.contract == payload.contract);
  if(already_in_store){
    // console.log('got config from store');
    return already_in_store.config;
  }

  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const config = await eos.getTableRows({
      json: true,
      scope: payload.contract,
      code: payload.contract,
      table: 'config'
    })
    if (!config.rows.length) {
      return false
    } else {
      commit('SET_CONTRACT_CONFIG', {contract:payload.contract, config: config.rows[0]})
      return config.rows[0];
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getContractState({
  state,
  commit,
}, payload) {
  console.log('getting contract state data');
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig);
    const cstate = await eos.getTableRows({
      json: true,
      scope: payload.contract,
      code: payload.contract,
      table: 'state'
    })
    if (!cstate.rows.length) {
      return false;
    } else {
      return cstate.rows[0];
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getRamPrice({
  state,
  commit
}) {
  try {
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    let eos = Eos(eosConfig)
    const ramInfo = await eos.getTableRows({
      json: true,
      scope: configFile.network.systemContract.name,
      code: configFile.network.systemContract.name,
      table: 'rammarket'
    })
    return ramInfo.rows[0]
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getProfileData({}, payload){
  // console.log(payload.accountname)
  let url = configFile.api.profileApiUrl+'profile/'+payload.accountname;

  return axios.get(url).then(r => {
      // console.log(r.data)
      return r.data;
    }).catch(e => {
      console.log('could not load profile file'); 
      return false;});
}

export async function getProfileData2({}, payload){

  let url = configFile.api.profileApiUrl;
  if (url.substr(-1) != '/'){
    url += '/profiles';
  }
  else{
    url += 'profiles';
  }

  return axios.post(url, payload.accountname ).then(r => {
      // console.log(r.data)
      return r.data;
    }).catch(e => {
      console.log('could not load profile file'); 
      return false;});
}
