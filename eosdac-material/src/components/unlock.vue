<template>
  <q-modal class="text-white z-max" maximized v-model="unlock">
    <div class="col-xs-12 col-sm-6 col-md-4 text-center">
<q-card dark flat class="q-ma-sm absolute-center">
  <q-card-title>
    <div class="q-title">Login account: <b>{{getAccountName}}</b></div>
  </q-card-title>
  <q-card-main>
    <q-field :error="error" icon="vpn key" label="Password" :error-label="errorText" :label-width="12">
      <q-input dark type="password" v-model="password" />
    </q-field>
  </q-card-main>
  <q-card-actions>
    <q-btn color="primary" @click="unlockAccount()">Login</q-btn>
    <q-btn icon="clear" color="danger" flat @click="unlock = false"></q-btn>
  </q-card-actions>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-card>
</div>
</q-modal>
</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'unlock',
  components: {
    LoadingSpinner
  },
  data () {
    return {
      unlock: false,
      account: '',
      password: '',
      error: false,
      errorText: '',
      loading: false,
      loadingText: ''
    }
  },
  methods: {
    open () {
      this.unlock = true
    },
    unlockAccount () {
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
    clear () {
      Object.assign(this.$data, this.$options.data())
      this.unlock = false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName'
    })
  },
  watch: {
    password () {
      this.error = false
    }
  }
}
</script>

<style>
</style>
