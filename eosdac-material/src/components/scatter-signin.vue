<template>
<div class="row fit q-pa-md">
  <div class="col-12">
    <h6 class="q-my-sm">Connection Type</h6>
    <p class="text-grey q-my-lg">Please choose an authentication type to sign into the eosDAC Member Client.</p>
  </div>
  <div class="col-12 q-my-xl">
    <q-field class="q-mt-xl" label="Choose Connection Type" :label-width="12">
      <q-select color="white" dark v-model="connectionMethod" radio :options="[{label:'Scatter',value:'Scatter'}]" />
    </q-field>
    <q-alert v-if="!hasScatter" message="Scatter is not available. If you have Scatter installed please refresh." class="text-truncate q-ma-sm" icon="info" color="grey" />
    <q-alert v-if="scatterError" class="text-truncate q-ma-lg" icon="info" color="grey">
      {{scatterErrorText}}
    </q-alert>
    <ScatterTutorial v-if="scatterError" />
  </div>
  <div class="col-12 q-mt-xl relative-position">
    <q-btn @click="useScatter()" style="min-width: 20%;" class="float-right no-shadow" size="12px" color="primary" label="SIGN IN" />
  </div>
  <LoadingSpinner :visible="loading" :text="loadingText" />
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
  methods: {
    async useScatter() {
      this.loading = true
      this.loadingText = 'Waiting for scatter...'
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
        chainId: this.$configFile.network.chainId,
        protocol: current.httpEndpoint.split(':')[0].replace(/\//g, ''),
        host: current.httpEndpoint.split(':')[1].replace(/\//g, ''),
        port: current.httpEndpoint.split(':')[2] || pp
      }
      try {
        let suggest = await this.getScatter.suggestNetwork(network2)
        let identity = await this.getScatter.getIdentity({
          accounts: [network2]
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
          this.scatterErrorText = 'Scatter is locked. Please unlock to continue.'
        } else if (err.type === 'identity_rejected') {
          this.scatterError = true
          this.scatterErrorText = 'Identity request was denied. Please try again and accept the request.'
        } else {
          this.scatterError = true
          this.scatterErrorText = err.message
        }
      }
    }
  }
}
</script>

<style>
</style>
