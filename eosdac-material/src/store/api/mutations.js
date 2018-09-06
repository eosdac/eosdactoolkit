
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
      lastConnection: true,
      lastConnectionStatus: null
    })
  }
}

export const CLEAR_ENDPOINTS = (state) => {
  state.endpoints = []
}

export const CHANGE_ENDPOINT = (state, url) => {
  let findEndpoint = state.endpoints.findIndex(findEndpoint => findEndpoint.httpEndpoint === url)
  state.activeEndpointIndex = findEndpoint
  state.endpoints[state.activeEndpointIndex].lastConnectionStatus = true
}

export const SET_CURRENT_CONNECTION_STATUS = (state, good) => {
  state.endpoints[state.activeEndpointIndex].lastConnectionStatus = good
}

export const SCATTER_AVAILABLE = (state, payload) => {
  state.scatterAvailable = true
  state.scatter = payload.scatter
  state.scatterChainId = payload.chainId
}

export const ADD_CONTRACT_RICARDIAN = (state, payload) => {
  state.ricardians[payload.contract] = payload.ricardian
}

export const NOTIFY = (state, payload) => {
  payload.seen = false
  payload.autoclose = payload.autoclose || 0
  state.notification = payload
}

export const CLOSE_NOTIFICATION = (state) => {
  state.notification = {}
  state.notification.seen = true
}

export const SET_CHAIN_ID = (state, id) => {
  state.chainId = id
}

export const SET_CONFIG = (state, config) => {
  state.clientConfig = config
}

export const SET_CONTRACT_CONFIG = (state, config) => {
  state.contractConfigs.push(config)
}
