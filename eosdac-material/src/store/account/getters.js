
export const getImported = (state) => {
  return state.imported
}

export const getRegistered = (state) => {
  return state.registered
}

export const getAccountName = (state) => {
  if (state.info) {
    return state.info.account_name
  } else {
    return false
  }
}

export const getAccount = (state) => {
  if (state.info) {
    return state.info
  } else {
    return false
  }
}

export const getUnlocked = (state) => {
  return state.unlocked
}

export const getLastUnlock= (state) => {
  return state.lastUnlock
}

export const getUsesScatter = (state) => {
  return state.useScatter
}

export const getAutolockInterval = (state) => {
  return state.autolockIntervalSec
}

export const getTokenBalance = (state) => {
  return state.tokenBalance
}
