
export const SET_LANGUAGE = (state, payload) => {
    state.language = payload;
}

export const SET_TRANSACTIONPOPUP = (state, payload) => {
    state.transactionPopup = payload;
}

export const SET_CONSOLEMESSAGE = (state, payload) => {
    state.consoleMessage = payload;
}

export const SET_RETROSTYLE = (state, payload) => {
    state.retroStyle = payload;
}

export const SET_TRANSACTIONDELAY = (state, payload) => {
    state.transactiondelay = payload;
}


export const SET_MSIGISSEENCACHE = (state, payload) => {
    let mode = payload.mode;
    let msig_id = payload.msig_id;

    switch(mode) {
        case 'add':
          if (state.msigIsSeenCache.indexOf(msig_id) === -1) state.msigIsSeenCache.push(msig_id);
          break;
        case 'remove':
          state.msigIsSeenCache = state.msigIsSeenCache.filter(m => m !== msig_id);
          break;
        case 'clear':
          state.msigIsSeenCache = [];
          break;
        default:
          // code block
      }

}