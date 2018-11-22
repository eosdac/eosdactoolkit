import VueSocketIO from 'vue-socket.io'

export default ({ store, Vue }) => {
  // something to do
  Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:8181',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
  }));
}
