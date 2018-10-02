export const IMPORT_ACCOUNT = (state, payload) => {
  state.info = payload.info
  state.imported = true
  if (payload.scatter) {
    state.useScatter = true
    state.unlocked = true
  } else {
    state.pkeys = payload.keys
  }
}

export const UPDATE_ACCOUNT_INFO = (state, payload) => {
  state.info = payload
}

export const UPDATE_TOKEN_BALANCE = (state, balance) => {
  state.tokenBalance = balance
}

export const UPDATE_MAIN_CURRENCY_BALANCE = (state, balance) => {
  state.mainCurrencyBalance = balance
}

export const LOCK_ACCOUNT = (state) => {
  state.pkeysArray = []
  state.unlocked = false
  state.info = null
}

export const UNLOCK_ACCOUNT = (state, payload) => {
  state.pkeysArray = payload.pkeysArray
  state.unlocked = true
  state.lastUnlock = Math.floor(Date.now() / 1000)
}

export const UNLOCK_ACCOUNT_SCATTER = (state) => {
  state.unlocked = true
  state.lastUnlock = Math.floor(Date.now() / 1000)
}

export const ADD_REGISTRATION = (state, version) => {
  state.registered.version = version
}

export const SET_FIRST_REGISTRATION = (state) => {
  state.firstReg = false
}

export const ADD_MEMBER_TERMS = (state, payload) => {
  let t = payload
  t.lastUpdate = Math.floor(Date.now() / 1000)
  state.registered.memberterms = t
}


export const REMOVE_REGISTRATION = (state) => {
  state.registered.version = null
}

export const ADD_TRANSFER_HISTORY = (state, payload) => {
  state.transferHistory = payload
}

export const RESET_STATE = (state) => {
  Object.assign(state, getDefaultState())
}

export const SET_MEMBER_ROLES = (state, roles) => {
  //role must be an  object for example {candidate: true} or {candidate: false, custodian: true, worker: true}
  //the role key must exist (ie being hardcoded) in the state
  if (Object.keys(roles).every(k => Object.keys(state.memberRoles).includes(k))) {
    Object.assign(state.memberRoles, roles);
  } else {
    console.log('One or more role keys are not allowed.')
  }

}

export const ADD_CONTACT = (state, payload) => {
  let findContact = state.contacts.find(findContact => {
    return findContact.value === payload
  })
  if (!findContact) {
    state.contacts.push({
      label: payload,
      value: payload
    })
  }
}

export const REMOVE_CONTACT = (state, payload) => {
  for (let i = 0; i < state.contacts.length; i++) {
    if (state.contacts[i].value === payload) {
      state.contacts.splice(i, 1)
      break
    }
  }
}
