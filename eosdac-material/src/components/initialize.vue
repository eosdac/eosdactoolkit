<template>
<q-modal class="text-white" v-model="init" no-esc-dismiss no-backdrop-dismiss>
  <!--<div class="q-mx-lg text-center" v-if="!start">
    <h4>eosDAC Toolkit</h4>
    <p style="min-height:150px;">
      Introduction text?
    </p>
    <q-btn class="q-ma-sm" color="primary" @click="start = true" label="Continue" />
  </div>
  <div v-else>-->
    <q-stepper v-model="curStep" v-show="!importInit" color="white" ref="initstepper" contractable no-header-navigation>
      <q-step active-icon="icon-airdrop" default title="API Endpoint" name="init1">
        <div class="row">
          <div class="col-xs-12 q-pa-sm">
            <p class="text-white text-center">An API endpoint is needed to enable communication with the eosDAC contracts on the EOS network.</p>
            <q-alert v-if="errorEndpoint" :message="errorEndpointText" class="text-truncate" icon="info" color="red" />
          </div>
          <div class="col-xs-12 col-md-6 q-pa-sm">
            <p class="text-white">Server to connect (API Endpoint)</p>
            <q-field label-width="12" dark>
              <q-input dark v-model="endpoint" placeholder="https://endpoint-url.com" />
            </q-field>
            <q-btn :disabled="badEndpoint" class="q-ma-sm" color="primary" @click="connect(endpoint)" label="Connect" />
          </div>
          <div v-if="!endpointListFail" class="col-xs-12 col-md-6 q-pa-sm">
            <p class="text-white">Endpoint from List</p>
            <q-select class="" placeholder="Select Endpoint from List" v-model="selectedEndpoint" dark radio :options="endpoints" />
            <q-btn :disabled="!selectedEndpoint" class="q-ma-sm" color="primary" @click="connect(selectedEndpoint)" label="Connect" />
          </div>
        </div>
      </q-step>
      <q-step class="text-center" title="Authentication" name="init2" icon="icon-member">
        <h4 class="text-white">Authentication Method</h4>
        <q-alert v-if="!hasScatter" message="Scatter is not available. If you have Scatter installed please refresh." class="text-truncate" icon="info" color="grey" />
        <q-alert v-if="scatterError" :message="scatterErrorText" class="text-truncate" icon="info" color="grey" />
        <q-btn v-if="$q.platform.is.desktop" @click="useScatter()" :disabled="!hasScatter" class="q-ma-sm" color="primary" label="Scatter" size="xl" />

        <q-btn v-else @click="importInit = true" class="q-ma-sm" color="primary" label="Import private keys" size="xl" />
      </q-step>
      <q-step title="Registration" name="init3">
        <Register ref="Register" v-on:registrationDone="init = false" />
      </q-step>
    </q-stepper>
    <Import v-bind:intro="true" v-if="importInit" v-on:importDone="checkRegister()" />
  <!--</div>-->
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import Import from 'components/import'
import Register from 'components/register'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Initialize',
  components: {
    LoadingSpinner,
    Import,
    Register
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
      getRegistered: 'account/getRegistered',
      getAccountName: 'account/getAccountName'
    })
  },
  mounted() {
    this.loadEndpoints()
  },
  methods: {
    checkRegister() {
      this.loading = true
      this.loadingText = 'Checking member status...'
      this.importInit = false
      this.$store.dispatch('api/getRegistered').then((res) => {
        this.loading = false
        let findAccount = res.rows.find(findAccount => {
          return findAccount.sender === this.getAccountName
        })
        if (findAccount) {
          this.$store.commit('account/ADD_REGISTRATION', findAccount.agreedterms)
          this.init = false
        } else {
          this.$refs.initstepper.next()
        }
      })
      this.loading = false
    },
    open() {
      this.init = true
    },
    async loadEndpoints() {
      this.loading = true
      this.loadingText = 'Gathering endpoints...'
      try {
        let getEndpoints = await this.$axios.get('https://eosdac.io/topbps.json')
        let res = []
        for (let i = 0; i < getEndpoints.data.length; i++) {
          if (getEndpoints.data[i].nodes) {
            for (let j = 0; j < getEndpoints.data[i].nodes.length; j++) {
              if (getEndpoints.data[i].nodes[j].ssl_endpoint) {
                res.push({
                  label: getEndpoints.data[i].nodes[j].ssl_endpoint,
                  value: getEndpoints.data[i].nodes[j].ssl_endpoint
                })
              }
            }
          }
        }
        this.endpoints = res
        this.loading = false
      } catch (error) {
        this.endpointListFail = true
      }
    },
    filterUrl (url) {
      if(url.substr(-1) === '/') {
        return url.substr(0, url.length - 1);
    } else {
        return url
      }
    },
    async connect(u) {
      this.loading = true
      this.loadingText = 'Connecting...'
      try {
        let url = await this.filterUrl(u)
        let test = await this.$store.dispatch('api/testEndpoint', url)
        this.loading = false
        this.$store.commit('api/ADD_ENDPOINT', {
          url,
          chainId: this.$configFile.network.chainId
        })
        this.$store.commit('api/CHANGE_ENDPOINT', url)
        this.$refs.initstepper.next()
      } catch (err) {
        this.loading = false
        this.errorEndpoint = true
        this.badEndpoint = true
        if (err.message.includes('Cannot POST')) {
          this.errorEndpointText = 'The URL seems to be invalid.'
        } else {
          switch (err.message) {
            case 'timeout':
              this.errorEndpointText = 'Connection to endpoint timed out.'
              break
            case 'NetworkError when attempting to fetch resource.':
              this.errorEndpointText = 'Could not connect to endpoint.'
              break
            case 'Wrong chainId':
              this.errorEndpointText = 'The chain ID returned by the endpoint is incorrect.'
              break
            case 'Failed to fetch':
              this.errorEndpointText = 'Could not connect to endpoint.'
              break
            default:
              this.errorEndpointText = err.message
          }
        }
      }
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
        this.checkRegister()
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
