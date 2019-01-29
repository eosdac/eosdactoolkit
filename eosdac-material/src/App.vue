<template>
  <div id="q-app">
    
    <router-view />
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      // loading: false,
      // loadingText: ''

    }
  },
  computed: {
    ...mapGetters({
      // getLOADING: 'usersettings/getLOADING',
      // getAccountName: 'account/getAccountName'
      })

  },
  methods:{

  }

}
</script>

<style>
</style>
