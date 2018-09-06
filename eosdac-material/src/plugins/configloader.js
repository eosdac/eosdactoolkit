import configFile from '../statics/config.json'
// leave the export, even if you don't use it
export default ({
  Vue,
  store
}) => {
  if (store.getters['api/getChainId']) {
    if (configFile.network.chainId !== store.getters['api/getChainId']) {
      console.log('New chain ID clearing endpoints')
      store.commit('api/CLEAR_ENDPOINTS')
    }
  }
  store.commit('api/SET_CHAIN_ID', configFile.network.chainId)
  store.commit('api/SET_CONFIG', configFile)
  Vue.prototype.$configFile = configFile
}

export {configFile}
