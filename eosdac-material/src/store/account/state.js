export default {
  accountName: null,
  imported: false,
  registered: {
    version: null,
    memberterms: null
  },
  memberRoles:{
    candidate: false,
    custodian: false,
    worker: false
  },
  firstReg: true,
  useScatter: false,
  info: {},
  keys: [],
  pkeys: [],
  pkeysArray: [],
  unlocked: false,
  lastUnlock: 0,
  autolock: true,
  autolockIntervalSec: 300,
  tokenBalance: 0,
  mainCurrencyBalance: 0,
  transferHistory: [],
  contacts: [],
  proposalDraft: {
    title: '',
    text: '',
    type: 'Proposal',
    parentId: 0,
    paymentAmount: 0,
    recurring: null,
    arbitrator: '',
    startDate: '',
    expireDate: '',
    dueDate: ''
  }
}
