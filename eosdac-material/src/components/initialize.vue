<template>
<q-modal class="text-white" maximized v-model="init">
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
      <q-stepper class="absolute-center" color="primary" ref="stepper" contractable>
        <q-step default title="API Endpoint">
          <q-alert message="An API endpoint is needed to enable communication with the eosDAC contracts on the EOS network." class="text-truncate" icon="info" color="grey" />
          <q-field label-width="12" label="API Endpoint URL" helper="SSL is highly recommended (https)" :error="errorEndpoint" :error-label="errorEndpointText" dark>
            <q-input dark v-model="endpoint" placeholder="https://endpoint-url.com" />
          </q-field>
          <q-stepper-navigation class="justify-center">
            <q-btn :disabled="badEndpoint" class="q-ma-sm" color="primary" @click="connect()" label="Connect" />
            <!--@click="$refs.stepper.next()"-->
          </q-stepper-navigation>
        </q-step>

        <!-- Step: -->
        <q-step title="Step 2">...</q-step>

        <!-- Step: -->
        <q-step title="Step 3" subtitle="Review and submit">...</q-step>

      </q-stepper>
    </div>
  </div>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
export default {
  name: 'Initialize',
  components: {
    LoadingSpinner
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
      badEndpoint: true
    }
  },
  methods: {
    open () {
      this.init = true
    },
    validate (url) {
      var pattern = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
      if (pattern.test(url)) {
        return true
      }
      return false
    },
    connect () {
      this.loading = true
      this.loadingText = 'Connecting...'
      this.$store.dispatch('api/testEndpoint', this.endpoint).then((res) => {
        this.loading = false
        alert(res)
      }, (err) => {
        this.loading = false
        this.$q.dialog({
          message: err
        })
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
