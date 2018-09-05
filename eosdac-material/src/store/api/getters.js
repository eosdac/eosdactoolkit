
export const getCurrentEndpoint = (state) => {
  if (state.endpoints[state.activeEndpointIndex]) {
    return state.endpoints[state.activeEndpointIndex]
  } else {
    return false
  }

}

export const getCurrentConnectionStatus = (state) => {
  if (state.endpoints[state.activeEndpointIndex]) {
    return state.endpoints[state.activeEndpointIndex].lastConnectionStatus
  } else {
    return false
  }

}

export const getChainId = (state) => {
  return state.chainId
}

export const getScatterChainId = (state) => {
  return state.scatterChainId
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

export const hasScatter = (state) => {
  return state.scatterAvailable
}

export const getScatter = (state) => {
  return state.scatter
}

export const getRicardians = (state) => {
  return state.ricardians
}

export const getNotification = (state) => {
  return state.notification
}

export const getConfig = (state) => {
  return state.clientConfig
}

export const getContractConfig = (state) => {
  return state.contractConfigs
}
