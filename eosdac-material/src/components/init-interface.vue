<template>

</template>

<script>
import {
  mapGetters
} from 'vuex'

import ScatterTutorial from 'components/scatter-tutorial'
export default {
  name: 'InitInterface',
  components: {

    ScatterTutorial
  },
  props: {
    autorun: Boolean
  },
  data() {
    return {
      scatterError: false,
      scatterErrorText: '',
      connectionMethod: 'scatter'
    }
  },
  computed: {
    ...mapGetters({
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getCurrentConnectionStatus: 'api/getCurrentConnectionStatus',
      hasScatter: 'api/hasScatter',
      getScatter: 'api/getScatter',
      getImported: 'account/getImported'
    })
  },
  mounted() {
    //preparation for multiple login interfaces
    // switch (this.connectionMethod) {
    //   case 'scatter':
    //     if(this.autorun && this.hasScatter && this.getImported){
    //       console.log('Pair scatter automatically.');
    //       this.pairScatter();
    //     }
    //     break;
    
    //   default:
    //     break;
    // }
  },

  methods: {
    auto_scatter(){
      if(this.hasScatter && this.getImported){
        this.pairScatter();
      }

    },
    async pairScatter() {
      if(!this.hasScatter){
        console.log('Scatter not detected.');
        //todo, gui for getting scatter
        return false;
      }

      let current = this.getCurrentEndpoint;
      let pp;
      if (current.httpEndpoint.split(':')[0].replace(/\//g, '') === 'https') {
        pp = 443
      } else if (current.httpEndpoint.split(':')[0].replace(/\//g, '') === 'http') {
        pp = 80
      } else {
        pp = null
      }
      let network2 = {
        blockchain: 'eos',
        chainId: current.chainId,
        protocol: current.httpEndpoint.split(':')[0].replace(/\//g, ''),
        host: current.httpEndpoint.split(':')[1].replace(/\//g, ''),
        port: current.httpEndpoint.split(':')[2] || pp
      }
      try {
        if (typeof this.getScatter.getVersion === 'function') { //is desktop
          let version = await this.getScatter.getVersion()
          if (this.versionCompare(version, '6.1.10') < 0) {
            throw Error('outdated')
          }
        } else if (typeof this.getScatter.requireVersion === 'function') { // is extension
          this.getScatter.requireVersion(6.1)
        }

        let suggest = await this.getScatter.suggestNetwork(network2)
        let identity = await this.getScatter.getIdentity({
          accounts: [{
            blockchain: 'eos',
            chainId: current.chainId
          }]
        })
        this.$store.commit('account/UNLOCK_ACCOUNT_SCATTER')
        //we should have an identity! do stuff with it...
        let queryAccount = await this.$store.dispatch('api/getAccount', {account_name: identity.accounts[0].name} );
        let memberRegistration = await this.$store.dispatch('api/getRegistered');
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
        this.$store.dispatch('api/getCustodians');

        this.$store.dispatch('api/getIsCandidate');
        this.$store.dispatch('api/getIsCustodian');//todo: should be checked from res getcustodians.

        this.$emit('done');

      //todo do error handling in GUI
      } catch (err) {
        if (err.type === 'locked') {
          this.scatterError = true
          this.scatterErrorText = 'scatter_signin.scatter_is_locked'
        } else if (err.type === 'identity_rejected') {
          this.scatterError = true
          this.scatterErrorText = 'scatter_signin.identity_request_denied'
        } else if (err.message === 'outdated') {
          this.scatterError = true
          this.scatterErrorText = 'scatter_signin.scatter_is_outdated'
        } else {
          this.scatterError = true
          if (typeof(err.message) != "undefined") {
            this.scatterErrorText = err.message
          } else {
            this.scatterErrorText = 'scatter_signin.scatter_is_not_available'
          }
        }
      }
    },
    versionCompare(v1, v2, options) {
      var lexicographical = (options && options.lexicographical) || false,
          zeroExtend = (options && options.zeroExtend) || true,
          v1parts = (v1 || "0").split('.'),
          v2parts = (v2 || "0").split('.');

      function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-zαß]*$/ : /^\d+[A-Za-zαß]?$/).test(x);
      }

      if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
      }

      if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
      }

      if (!lexicographical) {
        v1parts = v1parts.map(function(x){
         var match = (/[A-Za-zαß]/).exec(x);
         return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)):x);
        });
        v2parts = v2parts.map(function(x){
         var match = (/[A-Za-zαß]/).exec(x);
         return Number(match ? x.replace(match[0], "." + x.charCodeAt(match.index)):x);
        });
      }

      for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
          return 1;
        }

        if (v1parts[i] == v2parts[i]) {
          continue;
        }
        else if (v1parts[i] > v2parts[i]) {
          return 1;
        }
        else {
          return -1;
        }
      }

      if (v1parts.length != v2parts.length) {
        return -1;
      }

      return 0;
    }
  }
}
</script>

<style>
</style>
