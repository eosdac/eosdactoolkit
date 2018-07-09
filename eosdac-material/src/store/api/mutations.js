export const PING_ENDPOINT_SUCCESS = (state, payload) => {
  state.endpoints[state.activeEndpointIndex].ping = payload.ping
  state.endpoints[state.activeEndpointIndex].lastConnectionStatus = 0
  state.endpoints[state.activeEndpointIndex].lastConnection = Date.now()
  state.lastGetInfo = payload.getInfo
}

export const PING_ENDPOINT_STUCK = (state, payload) => {
  state.endpoints[state.activeEndpointIndex].ping = payload.ping
  state.endpoints[state.activeEndpointIndex].lastConnectionStatus = 2
  state.endpoints[state.activeEndpointIndex].lastConnection = Date.now()
  state.lastGetInfo = payload.getInfo
}

export const PING_ENDPOINT_FAIL = (state) => {
  state.endpoints[state.activeEndpointIndex].lastConnectionStatus = 1
}

export const ADD_ENDPOINT = (state, payload) => {
  let findEndpoint = state.endpoints.find(findEndpoint => {
    return findEndpoint.httpEndpoint === payload.url
  })
  if (!findEndpoint) {
    state.endpoints.push({
      chainId: payload.chainId,
      keyProvider: null,
      httpEndpoint: payload.url,
      expireInSeconds: 60,
      broadcast: true,
      debug: false,
      sign: true,
      ping: null,
      lastConnectionUnix: null,
      lastConnection: null,
      lastConnectionStatus: null
    })
  }
}

export const CHANGE_ENDPOINT = (state, url) => {
  let findEndpoint = state.endpoints.findIndex(findEndpoint => findEndpoint.httpEndpoint === url)
  state.activeEndpointIndex = findEndpoint
}

export const SCATTER_AVAILABLE = (state, scatter) => {
  state.scatterAvailable = true
  state.scatter = scatter
}
