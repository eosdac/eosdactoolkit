import Eos from 'eosjs'

export const testEndpoint = ({
  commit,
  state
}, url) => {
  return new Promise((resolve, reject) => {
    let eos = Eos({
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
    }, (err) => {
      clearTimeout(timeout)
      if (err) {
        commit('PING_ENDPOINT_FAIL')
        reject(Error('failed'))
      }
    })
  })
}
