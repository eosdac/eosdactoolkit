
export default {
  chainId: false,
  clientConfig: null,
  activeEndpointIndex: 0,
  checkIntervalMilSec: 10000,
  connectionTimeoutMilSec: 15000,
  scatterAvailable: false,
  scatter: null,
  scatterChainId: null,
  endpoints: [],
  lastGetInfo: {},
  ricardians: {},
  contractConfigs : [],
  activeCustodians: null,
  notification: {
    icon: '',
    color: '',
    message: '',
    details: '',
    seen: false,
    autoclose: 0
  }
}
