var consoleMsg;
setInterval(function(){ console.clear()}, 1000*60*30)
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
