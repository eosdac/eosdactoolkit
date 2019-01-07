import {
  configFile
} from './configloader.js'

import { initAccessContext } from 'wal-eos';
import scatter from 'wal-eos-scatter-provider';

export default ({
  store,
  app,
  router,
  Vue
}) => {
  console.log('dddddddddddddddddddddssssssss')
  const accessContext = initAccessContext({
    appName: 'eosdac_memberclient',
    network: {
      host: 'jungle2.cryptolions.io',
      port: 80,
      protocol: 'http',
      chainId: configFile.network.chainId
    },
    walletProviders: [
      scatter()
    ]
  });

  //store.commit('api/TRANSIT_API', {transitapi: ScatterJS.scatter, chainId: configFile.network.chainId})
}
