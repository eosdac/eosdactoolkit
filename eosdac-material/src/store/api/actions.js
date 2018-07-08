import Eos from 'eosjs'
import configFile from '../../statics/config.json'

export const testEndpoint = ({
  commit,
  state
}, url) => {
  return new Promise((resolve, reject) => {
    let eos = Eos({
      chainId: configFile.network.chainId,
      keyProvider: null,
      httpEndpoint: url,
      expireInSeconds: 60,
      broadcast: true,
      debug: false
    })
    let sTime = Date.now()
    let timeout = setTimeout(function () {
      commit('PING_ENDPOINT_FAIL')
      reject(Error('timeout'))
    }, 10000)
    eos.getInfo({}).then((res) => {
      clearTimeout(timeout)
      let ping = Math.floor((Date.now() - sTime) / 1000)
      let utcD = new Date().toISOString().slice(0, -5)
      if (res.chain_id !== configFile.network.chainId) {
        reject(Error('Wrong chainId'))
      } else {
        if (new Date(res.head_block_time).getTime() + 10000 > new Date(utcD).getTime()) {
          commit('PING_ENDPOINT_SUCCESS', {
            getInfo: res,
            ping: ping
          })
        } else {
          commit('PING_ENDPOINT_STUCK', {
            getInfo: res,
            ping: ping
          })
        }
        resolve(res)
      }
    }, (err) => {
      clearTimeout(timeout)
      if (err) {
        commit('PING_ENDPOINT_FAIL')
        reject(err)
      }
    })
  })
}

export const getAccount = ({
  state
}, payload) => {
  return new Promise((resolve, reject) => {
    let eos = Eos(state.endpoints[state.activeEndpointIndex])
    let timeout = setTimeout(function () {
      reject(Error('timeout'))
    }, state.connectionTimeoutMilSec)
    eos.getAccount({account_name: payload.account_name}).then((res) => {
      clearTimeout(timeout)
      resolve(res)
    }, (err) => {
      clearTimeout(timeout)
      if (err) {
        reject(Error('notFound'))
      }
    })
  })
}
