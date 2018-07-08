
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
  for (let i = 0; i < state.pkeys.length; i++) {
    state.pkeys[i].privateKey = ''
  }
  state.unlocked = false
}

export const UNLOCK_ACCOUNT = (state, payload) => {
  state.pkeys = payload
  state.unlocked = true
}
