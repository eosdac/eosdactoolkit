<template>
<q-modal class="relative-position fit" :content-css="{maxWidth: '900px', maxHeight: '610px'}" v-model="unlock" maximized>
  <div class="row justify-center">
    <div class="col-12 q-pa-lg">
      <q-card dark flat class="q-ma-sm">
        <q-card-title>
          <h6 class="q-my-sm">{{ $t('unlock.connection_type') }}</h6>
          <div slot="right" class="row items-center">
            <q-btn icon="icon-ui-8" color="white" flat @click="unlock = false"></q-btn>
          </div>
        </q-card-title>
        <q-alert v-if="!hasScatter" :message="$t('unlock.scatter_not_available')" class="text-truncate" icon="info" color="grey" />
        <q-alert v-if="scatterError" :message="$t(scatterErrorText)" class="text-truncate text-center" icon="info" color="secondary" />
        <q-card-main>
          <p class="q-body-1">{{ $t('unlock.choose_authentication_type') }}</p>
          <q-field :label="$t('unlock.choose_connection_type')" :label-width="12">
            <q-select dark v-model="connectionMethod" radio :options="[
     {label:'Scatter',value:'Scatter'}
      ]" />
          </q-field>
        </q-card-main>
        <q-card-actions align="center">
          <q-btn v-if="!getUsesScatter" color="primary" @click="unlockAccount()">{{ $t('unlock.login') }}</q-btn>
          <q-btn :disabled="!hasScatter" v-else color="primary" @click="unlockScatter()">{{ $t('unlock.login_with_scatter') }}</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-12 q-pa-lg">
      <NodeSelector v-if="netError" />
    </div>
  </div>
  <LoadingSpinner :visible="loading" :text="$t(loadingText)" />
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
      netError: false,
      connectionMethod: 'Scatter'
    }
  },
  methods: {
    open() {
      this.unlock = true
    },
    unlockAccount() {
      this.loading = true
      this.loadingText = 'unlock.decrypting_keys'
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
      this.loadingText = 'unlock.waiting_for_scatter'
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
          this.scatterErrorText = 'unlock.error_scatter_is_locked'
        } else if (err.type === 'identity_rejected') {
          this.scatterError = true
          this.scatterErrorText = 'unlock.error_identity_request_denied'
        } else {
          if (err.message === 'Failed to fetch') {
            this.scatterError = true
            this.netError = true
            this.scatterErrorText = 'unlock.error_could_not_connect'
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
      getScatter: 'api/getScatter',
      hasScatter: 'api/hasScatter'
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
