
export default {
  activeEndpointIndex: 0,
  checkIntervalMilSec: 3000,
  connectionTimeoutMilSec: 3000,
  scatterAvailable: false,
  scatter: null,
  endpoints: [
    {
      keyProvider: null,
      httpEndpoint: 'http://127.0.0.1:8888',
      expireInSeconds: 60,
      broadcast: true,
      debug: false,
      sign: true,
      ping: null,
      lastConnectionUnix: null,
      lastConnection: null,
      lastConnectionStatus: null
    }
  ],
  lastGetInfo: {
  }
}
