// const { Api, JsonRpc, RpcError, JsSignatureProvider, Serialize } = require('eosjs');
// const { TextDecoder, TextEncoder } = require('text-encoding');
// const fetch = require('node-fetch');

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

//initialize an eos object only when it doesn't exist yet
//rebuild eos with current set httpendpoint when flag is true
//this function is used in the api store (this). it also get called 
//in the nodeselector component (rebuild).
//todo: switch to eosjs@beta
export async function getEos({state, rootState, commit}, payload={rebuild:false} ){
  
  if(state.eosjs !== null && !payload.rebuild){
    return state.eosjs;
  }
  else{
    //eosjs@beta
    // const rpc = new JsonRpc(state.endpoints[state.activeEndpointIndex].httpEndpoint, { fetch });
    // const chainId = configFile.network.chainId;
    // state.eosjs = new Api({rpc, chainId, textDecoder: new TextDecoder(), textEncoder: new TextEncoder()});

    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint;
    state.eosjs = Eos(eosConfig);
    return state.eosjs;
  }

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
        message: this.$t('api.connection_to_endpoint_failed'),
        details: this.$t('api.connection_to_endpoint_failed_details'),
        textColor: 'black',
        autoclose: 8
      })
      c('SET_CURRENT_CONNECTION_STATUS', false)
    }
  }
}

export async function transaction({
  state,
  rootState,
  commit
}, payload) {
  try {
    // console.log(this._vm);
    // this._vm.$root.$emit('showloader')
    commit('usersettings/SET_LOADING', 'Loading Scatter', {root: true});
    eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint;
    // console.log("normal eos.fc", eos.fc)//works
    if (payload.scatter) {
      const network = await scatterNetwork(state)
      const identity = await state.scatter.getIdentity({
        accounts: [network]
      })

      let eos = state.scatter.eos(network, Eos, eosConfig);

      //if payload.add_abicache ie 'kasdactokens'
      if(payload.add_abicache){
        console.log('abicache addition', payload.add_abicache)
        console.log('eos.fc', eos.fc)
        const contract = await eos.getAbi(payload.add_abicache);
        let t = await eos.fc.abiCache.abi(payload.add_abicache, contract.abi);

      }
      else{
        // console.log('no abicache addition', payload.add_abicache)
      }

      let authority = identity.accounts[0].authority
      let accountname = identity.accounts[0].name
      let actions = [];

      for(let i = 0; i < payload.actions.length; i ++) {

        let auth = [ {actor: accountname, permission: authority} ];
        if(payload.actions[i].authorization){
          auth = payload.actions[i].authorization;
        }
        actions.push({
            account: payload.actions[i].contract,
            name: payload.actions[i].action,
            authorization: auth,
            data: payload.actions[i].fields
        })
      }

      let delay = rootState.usersettings.transactiondelay ? rootState.usersettings.transactiondelay : 0;
      setTimeout(()=>{commit('usersettings/SET_LOADING', 'Waiting For Signature', {root: true})},1000 );
      let res = await eos.transaction( { actions: actions }, { broadcast: true, delay_sec: delay } );
      
      // res.delay_sec = 30
      // console.log(res)
      // res = await eos.transaction( res )
      commit('usersettings/SET_LOADING', 'Transaction Succeeded',{root: true})
      setTimeout(()=>{commit('usersettings/SET_LOADING', false, {root: true}) } ,2500);
      return res
      commit('SET_CURRENT_CONNECTION_STATUS', true)
    }
  } catch (error) {
    apiDown(error,commit)
    commit('usersettings/SET_LOADING', 'Transaction Cancelled',{root: true})
    setTimeout(()=>{commit('usersettings/SET_LOADING', false, {root: true}) } ,2500);
    throw error
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
  console.log('Query member registration');
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const members = await eos.getTableRows({
      json: true,
      scope: configFile.network.tokenContract.name,
      code: configFile.network.tokenContract.name,
      table: 'members',
      lower_bound: rootState.account.info.account_name,
      limit:1
    })
    if (!members.rows.length) {
      commit('account/ADD_REGISTRATION', null, {root: true});
      return false
    } else {
      if (members.rows[0].sender === rootState.account.info.account_name) {
        commit('account/ADD_REGISTRATION', members.rows[0].agreedtermsversion, {root: true})
        return members.rows[0]
      } else {
        commit('account/ADD_REGISTRATION', null, {root: true});
        return false
      }
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

//This function queries the table to see if the accountname is a candidate. if payload.accountname is NOT specified
//then rootState.account.info.account_name is used as query parameter. in this case it will also update the store.
export async function getIsCandidate({
  state,
  commit,
  rootState
}, payload = {}) {
  if(configFile.network.custodianContract.name ===''){
    console.log('no custodian contract specified in config file.')
    return false;
  };
  let account_to_query = rootState.account.info.account_name;
  const flag_other_account = payload.accountname != undefined ? true : false;
  if(flag_other_account){
    account_to_query = payload.accountname;
  }
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const candidate = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'candidates',
      lower_bound: account_to_query,
      limit:1
    })
      if (!candidate.rows.length) {
        if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {candidate: false}, {root: true} );
        return false;
      } else {
        if (candidate.rows[0].candidate_name === account_to_query && candidate.rows[0].is_active) {
          if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {candidate: true}, {root: true} );
          return candidate.rows[0];
        } else {
          if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {candidate: false}, {root: true} );
          if(candidate.rows[0].candidate_name === account_to_query){
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

//This function queries the table to see if the accountname is a custodian. if payload.accountname is NOT specified
//then rootState.account.info.account_name is used as query parameter. in this case it will also update the store.
export async function getIsCustodian({
  state,
  commit,
  rootState
}, payload = {}) {
  if(configFile.network.custodianContract.name ===''){
    return false;
  };
  let account_to_query = rootState.account.info.account_name;
  const flag_other_account = payload.accountname != undefined ? true : false;
  if(flag_other_account){
    account_to_query = payload.accountname;
  }
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const custodian = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'custodians',
      lower_bound: account_to_query,
      limit:1
    })
    if (!custodian.rows.length) {
      if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {custodian: false}, {root: true} );
      return false;
    } else {
      if (custodian.rows[0].cust_name === account_to_query) {
        if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {custodian: true}, {root: true} );
        return custodian.rows[0];
      } else {
        if(!flag_other_account) commit('account/SET_MEMBER_ROLES', {custodian: false}, {root: true} );
        return false;
      }
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getCandidates({
  state,
  commit,

}, param) {

  try {
    // console.log(param)
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const custodians = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'candidates',
      lower_bound: param.lb,
      limit:-1
      // key_type: 'i64',
      // index_position:1
    })
    // console.log('getcandidates', custodians)
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

    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const votes = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'votes',
      lower_bound: param.member,
      limit:1
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

export async function getMemberTerms({
  state,
  commit
}) {
  console.log('Query latest terms');
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    let memberterms = await eos.getTableRows({
      json: true,
      scope: configFile.network.tokenContract.name,
      code: configFile.network.tokenContract.name,
      table: 'memberterms'
    })
    memberterms = memberterms.rows.sort(function(a, b) {
      return a.version - b.version;
    });
    let latest = memberterms.slice(-1)[0] 
    commit('account/ADD_MEMBER_TERMS', latest, {root: true})
    return latest
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
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const contract = await eos.getAbi(payload);
    
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
  if(!rootState.account.info){
    return false;
  }
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
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
  if(!rootState.account.info){
    return false;
  }
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
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
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');

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
    
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const account = await eos.getAccount({
      account_name: payload.account_name
    })
    commit('account/IMPORT_ACCOUNT', {info: account, scatter: true}, {root: true})
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
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
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
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig);
    let eos = await this.dispatch('api/getEos');
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
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
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

export async function getCustodians({
  state,
  commit,

}) {
  console.log('getting all custodians from chain.')
  try {
    // console.log(param)
    if(!state.endpoints[state.activeEndpointIndex]){
      return false;
    }
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const custodians = await eos.getTableRows({
      json: true,
      scope: configFile.network.custodianContract.name,
      code: configFile.network.custodianContract.name,
      table: 'custodians',
      limit:12
    });
    commit('SET_CURRENT_CONNECTION_STATUS', true);
    if (!custodians.rows.length) {
      return false;
    } else {
      commit('SET_ACTIVE_CUSTODIANS', custodians.rows);
      return custodians.rows;
    }
    
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getProposalsFromAccount({
  state,
  commit,

}, account) {

  try {
    // console.log(param)
    if(account == undefined){
      console.log('specify an accountname as argument');
      return false;
    }
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const proposals = await eos.getTableRows({
      json: true,
      scope: account,
      code: 'eosio.msig',
      table: 'proposal',
      limit:-1
    });
    if (!proposals.rows.length) {
      return false
    } else {
      return proposals.rows
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
  
}

export async function getProducers({
  state,
  commit,

}, param) {

  try {
    // console.log(param)
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const producers = await eos.getTableRows({
      json: true,
      scope: 'eosio',
      code: 'eosio',
      table: 'producers',
      limit:-1
    })
    if (!producers.rows.length) {
      return false
    } else {
      return producers.rows
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getProducerVotes({
  state,
  commit,
}, param) {
  try {

    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');
    const votes = await eos.getTableRows({
      json: true,
      scope: 'eosio',
      code: 'eosio',
      table: 'voters',
      lower_bound: param.member,
      limit:1
    });
    if (!votes.rows.length) {
      return []
    } else {
      // console.log(votes.rows[0].voter +'---'+param.member)
      if(votes.rows[0].owner === param.member){
        return votes.rows
      }
      else{
        return [];
      }

    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

// .getControlledAccounts(controlling_account)
export async function getControlledAccounts({
  state,
  commit,
  rootState
}, payload = {}) {

  let account_to_query = rootState.account.info.account_name;
  const flag_other_account = payload.accountname != undefined ? true : false;
  if(flag_other_account){
    account_to_query = payload.accountname;
  }
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');

    const controlledaccs = await eos.getControlledAccounts(account_to_query);
    // console.log('controlled accounts', controlledaccs);
    return controlledaccs;

    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getAccountPermissions({
  state,
  commit
}, payload) {
  try {
    // eosConfig.httpEndpoint = state.endpoints[state.activeEndpointIndex].httpEndpoint
    // let eos = Eos(eosConfig)
    let eos = await this.dispatch('api/getEos');

    const account = await eos.getAccount({
      account_name: payload.accountname
    });
    if(account.account_name == payload.accountname){
      return account.permissions;
    }
    else{
      console.log('error getting account '+payload.accountname);
      return false;
    }
    commit('SET_CURRENT_CONNECTION_STATUS', true)
  } catch (error) {
    apiDown(error,commit)
    throw error
  }
}

export async function getMsigProposals({}, payload={status:1}){
  //status 1: active; 2: executed; 0: cancelled
  let url = configFile.api.memberClientApiUrl
  return axios.post(url+'/msigproposals', payload).then(r => {
      // console.log(r.data)
      return r.data;
    }).catch(e => {
      console.log('could not load msig proposals from db');
      return [];});
}

export async function getApprovalsFromProposal({}, payload){
  try{
    let eos = await this.dispatch('api/getEos');

    let approvals = (await eos.getTableRows({
      code: 'eosiomsigold',
      json: true,
      limit: 1,
      lower_bound: payload.proposal_name,
      scope: payload.proposer,
      table: 'approvals'
      }) ).rows[0];
      
      return approvals;

  } catch(e){
    console.log(e);
    return [];
  }


}




