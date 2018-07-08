
export const IMPORT_ACCOUNT = (state, payload) => {
  state.info = payload.info
  state.imported = true
  if (payload.scatter) {
    state.useScatter = true
  } else {
    state.pkeys = payload.keys
  }
}
