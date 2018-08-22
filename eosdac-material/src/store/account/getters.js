
export const getAccountResources = (state) => {
  let res = {}
  if (state.info) {
    if (state.info.cpu_limit) {
      let cpu_limit = state.info.cpu_limit
      let available = parseFloat((100 - (cpu_limit.used / cpu_limit.available) * 100).toFixed(3))
      let used = parseFloat(((cpu_limit.used / cpu_limit.available) * 100).toFixed(3))
      res.cpu = {available, used, raw: cpu_limit, warning: (available < 10)? true: false}
    } else {
      res.cpu = null
    }
    if (state.info.net_limit) {
      let net_limit = state.info.net_limit
      let available = parseFloat((100 - (net_limit.used / net_limit.available) * 100).toFixed(3))
      let used = parseFloat(((net_limit.used / net_limit.available) * 100).toFixed(3))
      res.net = {available, used, raw: net_limit, warning: (available < 10)? true: false}
    } else {
      res.net = null
    }
    if (state.info.ram_usage && state.info.ram_quota) {
      let ram_limit = { used: state.info.ram_usage, available: state.info.ram_quota}
      let available = parseFloat((100 - (ram_limit.used / ram_limit.available) * 100).toFixed(3))
      let used = parseFloat(((ram_limit.used / ram_limit.available) * 100).toFixed(3))
      res.ram = {available, used, raw: ram_limit, warning: (available < 10)? true: false}
    } else {
      res.ram = null
    }
  } else {
    res = null
  }
  return res
}

export const getImported = (state) => {
  return state.imported
}

export const getRegistered = (state) => {
  if (state.registered.version && state.registered.memberterms) {
    if (state.registered.version === state.registered.memberterms.version) {
      return state.registered.version
    } else {
      return false
    }
  } else {
    return false
  }
}

export const getFirstReg = (state) => {
  return state.firstReg
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

export const getMainCurrencyBalance = (state) => {
  return state.mainCurrencyBalance
}

export const getTransferHistory = (state) => {
  return state.transferHistory
}

export const getLanguage = (state) => {
  return state.language
}
