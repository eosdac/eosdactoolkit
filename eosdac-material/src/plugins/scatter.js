import {
  configFile
} from './configloader.js'
import ScatterJS from 'scatter-js/dist/scatter.cjs'

export default ({
  store,
  app,
  router,
  Vue
}) => {
  ScatterJS.scatter.connect('EOSDAC Member Client').then(connected => {
    if (connected) {
      if (store.getters['api/getScatterChainId'] && configFile.network.chainId !== store.getters['api/getScatterChainId']) {
        console.log('New chain ID, forget identity')
        ScatterJS.scatter.getIdentity({
          accounts: [{
            blockchain: 'eos',
            chainId: store.getters['api/getScatterChainId']
          }]
        }).then(identity => {
          ScatterJS.scatter.forgetIdentity()
        })
      }
      store.commit('api/SCATTER_AVAILABLE', {scatter: ScatterJS.scatter, chainId: configFile.network.chainId})
      window.scatter = null
    }
  })
}
