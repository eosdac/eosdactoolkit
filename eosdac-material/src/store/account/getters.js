
export const getImported = (state) => {
  return state.imported
}

export const getRegistered = (state) => {
  return state.registered
}

export const getAccountName = (state) => {
  return state.info.account_name
}

export const getUnlocked = (state) => {
  return state.unlocked
}

export const getUsesScatter = (state) => {
  return state.useScatter
}

export const getAutolockInterval = (state) => {
  return state.getAutolockInterval
}
