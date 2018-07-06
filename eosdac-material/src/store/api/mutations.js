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
