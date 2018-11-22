<template>
  
<div>
  <q-btn label="test" @click="emittest" />
</div>

</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'socket',

  sockets: {
    // connect: function (data) {
    //     alert('connected')
    // },
    customEmit: function (data) {
      alert(data)
    }
  },

  data() {
    return {

    }
  },


  methods: {
    emittest(){
      this.$socket.emit('triger_emit', 'trigger data');
    }

  }
}
</script>

<style>
</style>
