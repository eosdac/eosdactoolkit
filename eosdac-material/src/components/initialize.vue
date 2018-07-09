<template>
<q-modal class="text-white" maximized v-model="init" v-on:hide="hide()">
  <div class="row justify-center">
    <div v-if="!start" class="col-xs-12 col-sm-6 col-md-4 text-center">
      <h4>eosDAC Toolkit</h4>
      <p class="q-ma-sm">
        Introduction text? Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
        duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
      </p>
      <q-btn class="q-ma-sm" color="primary" @click="start = true" label="Continue" />
      <q-btn class="q-ma-sm" color="primary" @click="init = false" label="Close" />
    </div>
    <div v-else class="col-xs-12 col-sm-6 col-md-4 text-center">
      <q-stepper v-if="!importInit" class="absolute-center" color="primary" ref="initstepper" contractable>
        <q-step default title="API Endpoint" name="init1">
          <q-alert message="An API endpoint is needed to enable communication with the eosDAC contracts on the EOS network." class="text-truncate" icon="info" color="grey" />
          <q-field label-width="12" label="API Endpoint URL" helper="SSL is highly recommended (https)" :error="errorEndpoint" :error-label="errorEndpointText" dark>
            <q-input dark v-model="endpoint" placeholder="https://endpoint-url.com" />
          </q-field>
          <q-stepper-navigation class="justify-center">
            <q-btn :disabled="badEndpoint" class="q-ma-sm" color="primary" @click="connect()" label="Connect" />
          </q-stepper-navigation>
        </q-step>
        <q-step title="Authentication" name="init2">
          <h4 class="text-white">Authentication Method</h4>
          <q-alert v-if="!hasScatter" message="Scatter is not available. If you have Scatter installed please refresh." class="text-truncate" icon="info" color="grey" />
          <q-alert v-if="scatterError" :message="scatterErrorText" class="text-truncate" icon="info" color="grey" />
          <q-btn @click="useScatter()" :disabled="!hasScatter" class="q-ma-sm" color="primary" label="Scatter (recommended)" size="xl" />
          <p class="text-white">OR</p>
          <q-btn @click="importInit = true" class="q-ma-sm" color="primary" label="Import private keys" size="xl" />
        </q-step>
      </q-stepper>
      <Import class="absolute-center" v-else />
    </div>
  </div>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import Import from 'components/import'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Initialize',
  components: {
    LoadingSpinner,
    Import
  },
  data () {
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
      importInit: false
    }
  },
  computed: {
    ...mapGetters({
      hasScatter: 'api/hasScatter',
      getCurrentEndpoint: 'api/getCurrentEndpoint'
    })
  },
  methods: {
    hide () {
      this.init = false
    },
    openInit () {
      this.init = true
    },
    validate (url) {
      var pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
      if (pattern.test(url)) {
        return true
      } else {
        return false
      }
    },
    connect () {
      this.loading = true
      this.loadingText = 'Connecting...'
      this.$store.dispatch('api/testEndpoint', this.endpoint).then((res) => {
        this.loading = false
        this.$store.commit('api/ADD_ENDPOINT', {
          url: this.endpoint,
          chainId: this.$configFile.network.chainId
        })
        this.$store.commit('api/CHANGE_ENDPOINT', this.endpoint)
        this.$refs.initstepper.next()
      }, (err) => {
        this.loading = false
        this.errorEndpoint = true
        this.badEndpoint = true
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
      })
    },
    useScatter () {
      this.loading = true
      this.loadingText = 'Waiting for scatter...'
      let current = this.getCurrentEndpoint
      let network = {
        blockchain: 'eos',
        host: current.httpEndpoint.split(':')[1].replace(/\//g, ''),
        port: current.httpEndpoint.split(':')[2] || 80,
        chainId: this.$configFile.network.chainId
      }
      let network2 = {
        blockchain: 'eos',
        host: current.httpEndpoint.split(':')[1].replace(/\//g, ''),
        port: current.httpEndpoint.split(':')[2] || 80
      }
      this.$scatter.suggestNetwork(network).then(() => {
        this.$scatter.getIdentity({
          accounts: [network2]
        }).then(identity => {
          this.$store.dispatch('api/getAccount', {
            account_name: identity.accounts[0].name
          }).then((res) => {
            this.loading = false
            this.$store.commit('account/IMPORT_ACCOUNT', {
              info: res,
              scatter: true
            })
            this.init = false
          }, (err) => {
            this.loading = false
            if (err === 'Error: notFound') {
              this.scatterError = true
              this.scatterErrorText = 'Could not find account.'
            } else {
              this.scatterError = true
              this.scatterErrorText = err
            }
          })
        }, (err) => {
          this.loading = false
          if (err.type === 'identity_rejected') {
            this.scatterError = true
            this.scatterErrorText = 'Identity request was denied. Please try again and accept the request'
          } else {
            this.scatterError = true
            this.scatterErrorText = err
          }
        })
      }, (err) => {
        this.loading = false
        if (err.type === 'locked') {
          this.scatterError = true
          this.scatterErrorText = 'Scatter is locked. Please unlock to continue'
        } else {
          this.scatterError = true
          this.scatterErrorText = 'Network request was denied. Please try again and accept the request'
        }
      })
    }
  },
  watch: {
    endpoint (val) {
      if (!val) {
        this.errorEndpoint = false
        this.errorEndpointText = ''
        this.badEndpoint = true
      } else if (!this.validate(val)) {
        this.errorEndpoint = true
        this.errorEndpointText = 'Invalid URL'
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
