
import configFile from '../statics/config.json'
// leave the export, even if you don't use it
export default ({ Vue }) => {
  Vue.prototype.$configFile = configFile
}
