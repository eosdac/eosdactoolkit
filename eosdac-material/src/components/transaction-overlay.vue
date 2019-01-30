<template>

<div class="animate-fade" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999" v-if="getLOADING" >
  <div class="row justify-end q-pa-md"><q-btn  round color="primary" icon="icon-ui-8" @click="$store.commit('usersettings/SET_LOADING', false);" /></div>
  <div class="fixed-center">
    <div class="text-center " style="height:80px">
      <q-icon v-if="getLOADING=='Loading Scatter'" name="icon-topmenu-3" class="text-p-light animate-bounce" size="50px" />
      <q-icon v-if="getLOADING=='Waiting For Signature'" name="vpn_key" class="text-p-light animate-bounce" size="50px" />
      <q-icon v-if="getLOADING=='Transaction Succeeded'" name="icon-ui-6" class="text-positive animate-scale" size="70px" />
      <q-icon v-if="getLOADING=='Transaction Cancelled'" name="error_outline" class="text-negative animate-scale" size="70px" />
    </div>
    <div class="text-center">{{getLOADING}}</div>
  </div>
</div>

</template>

<script>

import {
  mapGetters
} from 'vuex'
export default {
  name: 'TransactionOverlay',
  components: {
  
    
  },
  data() {
    return {

    }

  },
  computed: {
    ...mapGetters({
      getLOADING: 'usersettings/getLOADING'
    })
  },

  methods: {

    close() {
      // Object.assign(this.$data, this.$options.data())
      // this.visible = false
    },
   
  }
}
</script>

<style>
.ricardian {
  padding: 25px;
  width: auto;
  min-width: 0;
}
</style>
