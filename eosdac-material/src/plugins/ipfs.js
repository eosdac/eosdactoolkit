// import something here
const ipfsAPI = require('ipfs-api')
//import {ipfsAPI} from 'ipfs-api'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  Vue.prototype.$ipfs = ipfsAPI
}
