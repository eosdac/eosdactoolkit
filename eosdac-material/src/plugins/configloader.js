import configFile from '../statics/config.json'
// leave the export, even if you don't use it
export default ({
  Vue,
  store
}) => {
  if (!store.getters['api/getChainId']) {
    store.commit('api/SET_CHAIN_ID', configFile.network.chainId)
  } else if (configFile.network.chainId !== store.getters['api/getChainId']) {
    localStorage.clear()
    location.reload()
  }
  Vue.prototype.$configFile = configFile
}
