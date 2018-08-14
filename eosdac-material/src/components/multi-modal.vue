<template>
<q-modal @hide="close()" class="relative-position" :no-route-dismiss="!getImported" :no-backdrop-dismiss="!getImported" :no-esc-dismiss="!getImported" v-model="active" :content-css="{maxWidth: '900px', maxHeight: '610px'}">
  <q-tabs v-model="selectedTab" no-pane-border align="left" class="bg-dark2">
    <q-tab @click.native="initialmode === 'signin' ? mode = 'signin': mode = mode" slot="title" name="signin" label="SIGN IN" />
    <q-tab @click.native="mode = 'register'" slot="title" name="register" label="REGISTER AS A DAC-MEMBER" />
    <q-tab v-if="getImported" @click.native="close()" slot="title" name="close" icon="icon-ui-8" />
    <q-stepper class="bg-dark no-shadow" v-model="step" color="white" ref="stepper" contractable no-header-navigation>
      <q-step active-icon="icon-register-1" done-icon="icon-register-1" default title="API Endpoint" name="step1">
        <NodeSelector v-if="mode !== 'sign' && active" setup v-on:done="$refs.stepper.next()" />
      </q-step>
      <q-step v-if="!getAccountName" title="Authentication" name="step2" active-icon="icon-register-2"  done-icon="icon-register-2" icon="icon-register-2">
        <div class="row">
          <div class="col-12">
        <h6 class="text-white q-mt-none q-mb-lg">Connection Type</h6>
        <p class="q-body-2 text-grey">Please choose an authentication type to sign into the eosDAC Member Client.</p>
        </div>
        <div class="col-12 q-my-xl">
        <q-field label="Choose Connection Type" :label-width="12">
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
      </div>
      </q-step>
      <q-step v-else title="Authentication" name="step2" active-icon="icon-register-2" done-icon="icon-register-2" icon="icon-register-2">
        <div class="row q-ma-xl">
          <div class="col-12">
            <q-alert icon="icon-ui-6" color="positive">
              You are successfully signed in.
            </q-alert>
        </div>
      </div>
      </q-step>
      <q-step active-icon="icon-register-3" done-icon="icon-register-3" icon="icon-register-3" title="Registration" name="step3">
      </q-step>
    </q-stepper>
    <Register class="q-ma-sm" v-show="getAccountName" ref="reg" />
  </q-tabs>
  <LoadingSpinner :visible="loading" :text="loadingText" />
  </div>
</q-modal>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import LoadingSpinner from 'components/loading-spinner'
import NodeSelector from 'components/nodeselector'
import ScatterTutorial from 'components/scatter-tutorial'
import Register from 'components/register'
export default {
  name: 'MultiModal',
  components: {
    LoadingSpinner,
    NodeSelector,
    ScatterTutorial,
    Register
  },
  computed: {
    ...mapGetters({
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getCurrentConnectionStatus: 'api/getCurrentConnectionStatus',
      hasScatter: 'api/hasScatter',
      getScatter: 'api/getScatter',
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getImported: 'account/getImported'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: 'loading...',
      active: false,
      step: 'step1',
      connectionMethod: 'Scatter',
      scatterError: false,
      scatterErrorText: '',
      regCheck: false,
      selectedTab: '',
      mode: 'register',
      initialmode : ''
    }
  },
  mounted () {
  },
  methods: {
    init (mode) {
      this.active = true
      this.mode = mode
      this.initialmode = mode
      if (mode !== 'sign') {
        this.selectTab(mode)
      } else {
        this.selectTab('register')
        this.$refs.stepper.goToStep('step3')
        this.$refs.reg.init()
      }
    },
    close() {
      Object.assign(this.$data, this.$options.data())
      this.active = false
    },
    selectTab (name) {
      this.selectedTab = name
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
        if (this.mode === 'register') {
          this.selectedTab = 'register'
          this.$refs.stepper.goToStep('step3')
          this.$refs.reg.init()
        } else {
          await this.$refs.reg.checkRegistered()
          this.close()
        }
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
