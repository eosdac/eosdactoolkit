
export const IMPORT_ACCOUNT = (state, payload) => {
  state.info = payload.info
  state.imported = true
  if (payload.scatter) {
    state.useScatter = true
  } else {
    state.pkeys = payload.keys
  }
}

export const LOCK_ACCOUNT = (state) => {
  state.pkeysArray = []
  state.unlocked = false
}

export const UNLOCK_ACCOUNT = (state, payload) => {
  state.pkeysArray = payload.pkeysArray
  state.unlocked = true
}

export const UNLOCK_ACCOUNT_SCATTER = (state) => {
  state.unlocked = true
}

export const ADD_REGISTRATION = (state, payload) => {
  state.rigistered = payload
}

export const RESET_STATE = (state) => {
    Object.assign(state, getDefaultState())
}
