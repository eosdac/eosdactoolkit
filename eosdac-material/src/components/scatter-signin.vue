<template>
<div class="row fit q-pa-md">
  <div class="col-12">
    <h6 class="q-my-sm">{{ $t('scatter_signin.connection_type') }}</h6>
    <p class="text-grey q-my-lg">{{ $t('scatter_signin.choose_authentication_type') }}</p>
  </div>
  <div class="col-12 q-my-xl">
    <q-field class="q-mt-xl" :label="$t('scatter_signin.choose_connection_type')" :label-width="12">
      <q-select color="white" dark v-model="connectionMethod" radio :options="[{label:'Scatter',value:'Scatter'}]" />
    </q-field>
    <q-alert v-if="!hasScatter" :message="$t('scatter_signin.scatter_is_not_available')" class="text-truncate q-ma-sm" icon="info" color="grey" />
    <q-alert v-if="scatterError" class="text-truncate q-ma-lg" icon="info" color="grey">
      {{ $t(scatterErrorText) }}
    </q-alert>
    <ScatterTutorial v-if="scatterError" />
  </div>
  <div class="col-12 q-mt-xl relative-position">
    <q-btn @click="useScatter()" style="min-width: 20%;" class="float-right no-shadow" size="12px" color="primary" :label="$t('scatter_signin.sign_in')" />
  </div>
  <LoadingSpinner :visible="loading" :text="$t(loadingText)" />
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import LoadingSpinner from 'components/loading-spinner'
import ScatterTutorial from 'components/scatter-tutorial'
export default {
  name: 'ScatterSignIn',
  components: {
    LoadingSpinner,
    ScatterTutorial
  },
  props: {
    skipSelection: Boolean
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      scatterError: false,
      scatterErrorText: '',
      connectionMethod: 'Scatter'
    }
  },
  computed: {
    ...mapGetters({
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getCurrentConnectionStatus: 'api/getCurrentConnectionStatus',
      hasScatter: 'api/hasScatter',
      getScatter: 'api/getScatter'
    })
  },
  mounted() {
    if (this.skipSelection) {
      this.useScatter()
    }
  },
  methods: {
    async useScatter() {
      this.loading = true
      this.loadingText = 'scatter_signin.waiting_for_scatter'
      let current = this.getCurrentEndpoint
      let pp
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
        let queryAccount = await this.$store.dispatch('api/getAccount', {
          account_name: identity.accounts[0].name
        })
        this.$store.commit('account/IMPORT_ACCOUNT', {
          info: queryAccount,
          scatter: true
        })
        this.$store.commit('account/UNLOCK_ACCOUNT_SCATTER')
        this.loading = false
        this.$emit('done')
      } catch (err) {
        this.loading = false
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
