
import ScatterJS from 'scatter-js/dist/scatter.cjs'

export default ({store, app, router, Vue }) => {
  ScatterJS.scatter.connect('EOSDAC Member Client').then(connected => {
    if (connected) {
      store.commit('api/SCATTER_AVAILABLE', ScatterJS.scatter)
      window.scatter = null
      store.getters['api/getScatter'].forgetIdentity()
    }
  })
}
