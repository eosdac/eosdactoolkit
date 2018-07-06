export const getCurrentEndpoint = (state) => {
  return state.endpoints[state.activeEndpointIndex]
}

export const getEndpoints = (state) => {
  return state.endpoints
}

export const getLastInfo = (state) => {
  return state.lastGetInfo
}

export const getConnectionTimeout = (state) => {
  return state.connectionTimeoutMilSec
}

export const getConnectionInterval = (state) => {
  return state.checkIntervalMilSec
}
