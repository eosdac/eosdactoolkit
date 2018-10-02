
export const getAccountResources = (state) => {
  let res = {}
  if (state.info) {
    if (state.info.cpu_limit) {
      let cpu_limit = {available: parseInt(state.info.cpu_limit.available), max: parseInt(state.info.cpu_limit.max), used: parseInt(state.info.cpu_limit.used)}
      let available = parseFloat((100 - (parseInt(cpu_limit.used) / parseInt(cpu_limit.available)) * 100).toFixed(3))
      available = (!isFinite(available)) ? 0: available
      let used = parseFloat(((parseInt(cpu_limit.used) / parseInt(cpu_limit.available)) * 100).toFixed(3))
      used = (!isFinite(used)) ? 0: used
      res.cpu = {available, used, raw: cpu_limit, warning: (available < 10)? true: false}
    } else {
      res.cpu = null
    }
    if (state.info.net_limit) {
      let net_limit = {available: parseInt(state.info.net_limit.available), max: parseInt(state.info.net_limit.max), used: parseInt(state.info.net_limit.used)}
      let available = parseFloat((100 - (parseInt(net_limit.used) / parseInt(net_limit.available)) * 100).toFixed(3))
      available = (!isFinite(available)) ? 0: available
      let used = parseFloat(((parseInt(net_limit.used) / parseInt(net_limit.available)) * 100).toFixed(3))
      used = (!isFinite(used)) ? 0: used
      res.net = {available, used, raw: net_limit, warning: (available < 10)? true: false}
    } else {
      res.net = null
    }
    if (state.info.ram_usage && state.info.ram_quota) {
      let ram_limit = { used: parseInt(state.info.ram_usage), available: parseInt(state.info.ram_quota)}
      let available = parseFloat((100 - (parseInt(ram_limit.used) / parseInt(ram_limit.available)) * 100).toFixed(3))
      available = (!isFinite(available)) ? 0: available
      let used = parseFloat(((parseInt(ram_limit.used) / parseInt(ram_limit.available)) * 100).toFixed(3))
      used = (!isFinite(used)) ? 0: used
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

export const getRegisteredVersionUpdate = (state) => {
  if (state.registered.version && state.registered.memberterms) {
    if (state.registered.version < state.registered.memberterms) {
      return true
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

export const getLastUnlock = (state) => {
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

export const getMemberRoles = (state) => {
  return state.memberRoles
}

export const getUnlocked = (state) => {
  return state.unlocked
}

export const getContacts = (state) => {
  return state.contacts
}
