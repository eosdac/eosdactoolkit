var consoleMsg;
export default ({
  Vue,
  store
}) => {

  consoleMsg = function (msg){
    if (store.getters['usersettings/getConsoleMessage']) {
        console.log(msg);
    }
  }
  Vue.prototype.$consoleMsg = consoleMsg
}
