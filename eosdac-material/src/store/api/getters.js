import configFile from '../../statics/config.json'

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

export const getTokenContractRicardian = (state) => {
  let findRicardian = state.ricardians.find(findRicardian => {
    return findRicardian.contract === configFile.network.tokenContract.name
  })
  if (findRicardian) {
    return findRicardian.ricardian
  } else {
    return null
  }
}

export const getMainCurrencyContractRicardian = (state) => {
  let findRicardian = state.ricardians.find(findRicardian => {
    return findRicardian.contract === configFile.network.mainCurrencyContract.name
  })
  if (findRicardian) {
    return findRicardian.ricardian
  } else {
    return null
  }
}

export const getNotification = (state) => {
    return state.notification
}
