<template>
<q-modal class="text-white" v-model="init" no-esc-dismiss no-backdrop-dismiss>
  <q-stepper v-model="curStep" v-show="!importInit" color="white" ref="initstepper" contractable no-header-navigation>
    <q-step active-icon="icon-register-1" default title="API Endpoint" name="init1">
      <NodeSelector setup v-on:done="$refs.initstepper.next()" />
    </q-step>
    <q-step class="text-center" title="Authentication" name="init2" icon="icon-register-2">
      <h4 class="text-white">Authentication Method</h4>
      <q-alert v-if="!hasScatter" message="Scatter is not available. If you have Scatter installed please refresh." class="text-truncate" icon="info" color="grey" />
      <q-alert v-if="scatterError" class="text-truncate q-mb-lg" icon="info" color="grey">
        <p>{{scatterErrorText}}
        </p>
      </q-alert>
      <q-btn v-if="$q.platform.is.desktop" @click="useScatter()" :disabled="!hasScatter" class="q-ma-sm" color="primary" label="Scatter" size="xl" />
      <ScatterTutorial v-if="scatterError" color="white" />
      <!--<q-btn v-else @click="importInit = true" class="q-ma-sm" color="primary" label="Import private keys" size="xl" />-->
    </q-step>
  </q-stepper>
  <Import v-bind:intro="true" v-if="importInit" v-on:importDone="checkRegister()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import ScatterTutorial from 'components/scatter-tutorial'
import NodeSelector from 'components/nodeselector'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Initialize',
  components: {
    LoadingSpinner,
    NodeSelector,
    ScatterTutorial
  },
  data() {
    return {
      loading: false,
      loadingText: 'loading...',
      init: false,
      start: false,
      endpoint: '',
      errorEndpoint: false,
      errorEndpointText: '',
      badEndpoint: true,
      scatterError: false,
      scatterErrorText: '',
      importInit: false,
      curStep: 'init1',
      selectedEndpoint: '',
      endpoints: [],
      endpointListFail: false
    }
  },
  computed: {
    ...mapGetters({
      hasScatter: 'api/hasScatter',
      getScatter: 'api/getScatter',
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getAccountName: 'account/getAccountName'
    })
  },
  mounted() {
  },
  methods: {
    open() {
      this.init = true
    },
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
        //if error explain that....
        let queryAccount = await this.$store.dispatch('api/getAccount', {
          account_name: identity.accounts[0].name
        })
        this.$store.commit('account/IMPORT_ACCOUNT', {
          info: queryAccount,
          scatter: true
        })
        this.$store.commit('account/UNLOCK_ACCOUNT_SCATTER')
        this.loading = false
        this.init = false
      } catch (err) {
        this.loading = false
        if (err.type === 'locked') {
          this.scatterError = true
          this.scatterErrorText = 'Scatter is locked. Please unlock to continue'
        } else if (err.type === 'identity_rejected') {
          this.scatterError = true
          this.scatterErrorText = 'Identity request was denied. Please try again and accept the request'
        } else {
          this.scatterError = true
          this.scatterErrorText = err.message
        }
      }
    }
  },
  watch: {
    endpoint(val) {
      if (!val) {
        this.errorEndpoint = false
        this.errorEndpointText = ''
        this.badEndpoint = true
      } else {
        this.errorEndpoint = false
        this.errorEndpointText = ''
        this.badEndpoint = false
      }
    }
  }
}
</script>

<style>
</style>
