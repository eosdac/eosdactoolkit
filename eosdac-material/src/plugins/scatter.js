import {
  configFile
} from './configloader.js'
// import ScatterJS from 'scatter-js/dist/scatter.cjs'
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
ScatterJS.plugins( new ScatterEOS() );

export default ({
  store,
  app,
  router,
  Vue
}) => {
  ScatterJS.scatter.connect('EOSDAC Member Client').then(connected => {
    if (connected) {
      if (store.getters['api/getScatterChainId'] && configFile.network.chainId !== store.getters['api/getScatterChainId']) {
        console.log('New chain ID detected');
        ScatterJS.scatter.forgetIdentity().then(() => {
          console.log('Identity forgotten.');
          ScatterJS.scatter.getIdentity({
            accounts: [{
              blockchain: 'eos',
              chainId: store.getters['api/getScatterChainId']
            }]
          }).then(identity => {console.log(`New identity for chainid: ${store.getters['api/getScatterChainId']}`)});  
        })
      }
      store.commit('api/SCATTER_AVAILABLE', {scatter: ScatterJS.scatter, chainId: configFile.network.chainId})
      window.scatter = null
    }
  })
}
