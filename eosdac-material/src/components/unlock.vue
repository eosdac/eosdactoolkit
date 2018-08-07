<template>
<q-modal class="text-white relative-position" v-model="unlock">
  <div class="row full-width justify-center" style="width:50%;">
    <div class="col-12 q-pa-lg">
      <q-card dark flat class="q-ma-sm">
        <q-card-title>
          <h4 class="q-my-sm">Login</h4>
          <div slot="right" class="row items-center">
          <q-btn icon="clear" color="white" flat @click="unlock = false"></q-btn>
          </div>
        </q-card-title>
        <q-alert v-if="scatterError" :message="scatterErrorText" class="text-truncate text-center" icon="info" color="secondary" />
        <q-card-main v-if="!getUsesScatter">
          <q-field :error="error" icon="vpn key" label="Password" :error-label="errorText" :label-width="12">
            <q-input dark type="password" v-model="password" />
          </q-field>
        </q-card-main>
        <q-card-actions align="center">
          <q-btn v-if="!getUsesScatter" color="primary" @click="unlockAccount()">Login</q-btn>
          <q-btn v-else color="primary" @click="unlockScatter()">Login with Scatter</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 q-pa-lg">
      <NodeSelector v-if="netError" />
    </div>
  </div>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import NodeSelector from 'components/nodeselector'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'unlock',
  components: {
    LoadingSpinner,
    NodeSelector
  },
  data() {
    return {
      unlock: false,
      account: '',
      password: '',
      error: false,
      errorText: '',
      loading: false,
      loadingText: '',
      scatterError: false,
      scatterErrorText: '',
      netError: false
    }
  },
  methods: {
    open() {
      this.unlock = true
    },
    unlockAccount() {
      this.loading = true
      this.loadingText = 'Decrypting keys...'
      this.$store.dispatch('account/unlockAccount', this.password).then(() => {
        this.loading = false
        this.clear()
      }, (err) => {
        if (err) {
          this.loading = false
          this.error = true
          this.errorText = err.message
        }
      })
    },
    async unlockScatter() {
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
        this.loading = false
        this.$store.commit('account/UNLOCK_ACCOUNT_SCATTER')
        this.clear()
      } catch (err) {
        this.loading = false
        if (err.type === 'locked') {
          this.scatterError = true
          this.scatterErrorText = 'Scatter is locked. Please unlock to continue'
        } else if (err.type === 'identity_rejected') {
          this.scatterError = true
          this.scatterErrorText = 'Identity request was denied. Please try again and accept the request'
        } else {
          if (err.message === 'Failed to fetch') {
            this.scatterError = true
            this.netError = true
            this.scatterErrorText = 'Could not connect to endpoint. Please choose a different endpoint and try again.'
          } else {
            this.scatterError = true
            this.scatterErrorText = err.message
          }
        }
      }
    },
    clear() {
      Object.assign(this.$data, this.$options.data())
      this.unlock = false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUsesScatter: 'account/getUsesScatter',
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getScatter: 'api/getScatter'
    })
  },
  watch: {
    password() {
      this.error = false
    }
  }
}
</script>

<style>
</style>
