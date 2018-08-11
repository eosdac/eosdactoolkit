<template>
<div v-if="setup">
  <div v-if="setupError" class="row justify-center">
    <div class="col-sm-12 text-center">
      <div class="row justify-center">
        <div class="col-sm-12 q-pa-sm text-center">
          <q-alert v-if="errorEndpoint" :message="errorEndpointText" class="text-truncate" icon="info" color="red" />
          <q-alert v-if="successEndpoint" message="Endpoint set successfully" class="text-truncate" icon="icon-ui-6" color="positive" />
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-sm-12 q-pa-sm text-center">
          <q-field label="Custom Endpoint" label-width="12" dark>
            <q-input dark v-model="endpoint" placeholder="https://endpoint-url.com" />
          </q-field>
          <q-btn :disabled="badEndpoint" class="q-ma-sm" color="primary" @click="connect(endpoint)" label="Connect" />
        </div>
      </div>
    </div>
  </div>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</div>
<div v-else>
  <div class="row justify-center">
    <div class="col-sm-12 col-lg-6 q-pa-sm text-center">
      <q-alert v-if="errorEndpoint" :message="errorEndpointText" class="text-truncate" icon="info" color="red" />
      <q-alert v-if="successEndpoint" message="Endpoint set successfully" class="text-truncate" icon="icon-ui-6" color="positive" />
    </div>
  </div>
  <div class="row relative-position justify-center">
    <div class="col-sm-12 col-lg-6 q-pa-sm text-center">
          <div class="row justify-center">
            <div v-if="!endpointListFail" class="col-sm-12 q-pa-sm text-center">
              <p class="text-white">Click <b>{{ $t('connect') }}</b> below to automatically connect to the fastest endpoint to your location selected from the top EOS block producers.</p>
              <q-btn class="q-ma-sm" color="primary" @click="getFastestNode() " label="Connect" />
            </div>
          </div>
          </div>
<div class="col-sm-12 col-lg-6 q-pa-sm text-center">
          <div class="row full-width justify-center">
            <div class="col-sm-12 q-pa-sm text-center">
              <p class="text-white">Select the endpoint you would like to use and click <b>Connect</b>. Endpoints from the top block producers have been provided for you, but you can also specify your own custom endpoint by populating the
                input with a url, and pressing <b>Connect</b>.</p>
            </div>
            <div class="col-sm-12 q-pa-sm">
              <q-field label="Choose Endpoint from List" label-width="12" dark>
              <q-select placeholder="Select Endpoint from List" v-model="selectedEndpoint" dark radio :options="endpoints" />
              </q-field>
              <q-btn :disabled="!selectedEndpoint" class="q-ma-sm float-right" color="primary" @click="connect(selectedEndpoint)" label="Connect" />
            </div>
            <div class="col-sm-12 q-pa-sm">
              <q-field label="Custom Endpoint" label-width="12" dark>
                <q-input dark v-model="endpoint" placeholder="https://endpoint-url.com" />
              </q-field>
              <q-btn :disabled="badEndpoint" class="q-ma-sm float-right" color="primary" @click="connect(endpoint)" label="Connect" />
            </div>

          </div>

    </div>
    <LoadingSpinner :visible="loading" :text="loadingText" />
  </div>
</div>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import NodeSelector from 'components/modules/nodeselector.js'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'NodeSelector',
  props: {
    setup: Boolean
  },
  components: {
    LoadingSpinner
  },
  computed: {
    ...mapGetters({
      getCurrentEndpoint: 'api/getCurrentEndpoint'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      endpoint: '',
      errorEndpoint: false,
      errorEndpointText: '',
      badEndpoint: false,
      selectedEndpoint: '',
      endpoints: [],
      endpointListFail: false,
      successEndpoint: false,
      fastest: '',
      setupError: false
    }
  },
  mounted() {
    if (this.setup) {
      this.getFastestNode()
    } else {
      this.loadEndpoints()
    }
    if (this.getCurrentEndpoint) {
      this.errorEndpoint = false
      this.badEndpoint = false
      this.endpoint = this.getCurrentEndpoint.httpEndpoint
    }
  },
  methods: {
    async getFastestNode() {
      let s = new NodeSelector(this.$configFile.api.bpNodeApiUrl)
      this.loading = true
      this.loadingText = 'Gathering endpoints...'
      let fastest = await s.get_fastest_node()
      if (fastest) {
        this.connect(fastest.node)
      }
      this.loading = false
    },
    async loadEndpoints() {
      let s = new NodeSelector(this.$configFile.api.bpNodeApiUrl)
      this.loading = true
      this.loadingText = 'Gathering endpoints...'
      try {
        let getEndpoints = await s.get_nodes()
        let res = []
        getEndpoints.forEach(function(element) {
          res.push({
            label: element,
            value: element
          })
        })
        this.endpoints = res
        this.loading = false
      } catch (error) {
        this.endpointListFail = true
      }
    },
    filterUrl(url) {
      if (url.substr(-1) === '/') {
        return url.substr(0, url.length - 1);
      } else {
        return url
      }
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async endpointSuccess() {
      this.successEndpoint = true
      await this.sleep(3000)
      this.successEndpoint = false
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
        this.endpointSuccess()
        this.$emit('done')
      } catch (err) {
        this.loading = false
        this.errorEndpoint = true
        if (this.setup) {
          this.setupError = true
          this.loadEndpoints()
        }
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
              this.errorEndpointText = 'Could not connect to endpoint.'
          }
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
