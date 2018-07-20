<template>
  <q-modal class="text-white z-max" v-model="visible" no-esc-dismiss :content-css="{maxWidth: '30vw'}" no-backdrop-dismiss>
        <q-card dark>
          <q-card-title>
            <div class="q-title">Transaction</div>
          </q-card-title>
          <q-list>
            <q-item>
              <q-item-main label="Action" />
              <q-item-side right>
                {{action}}
              </q-item-side>
            </q-item>
          </q-list>
          <q-list>
            <q-list-header>Fields</q-list-header>
            <q-item v-for="(field, key) in fields" :key="key">
              <q-item-main :label="key + ':'" />
              <q-item-side right>
                {{field}}
              </q-item-side>
            </q-item>
          </q-list>
          <div v-html="ricardian" class="markdown-body ricardian q-pa-md">
        </div>
          <q-card-actions>
            <q-btn color="primary" @click="transact()">Send</q-btn>
            <q-btn v-if="!cancelable" color="danger" @click="visible = false">Cancel</q-btn>
          </q-card-actions>
          <LoadingSpinner :visible="loading" :text="loadingText" />
        </q-card>
        <Unlock ref="Unlock" />
  </q-modal>
</template>

<script>
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'
import { mapGetters } from 'vuex'
import Unlock from 'components/unlock'
export default {
   name: 'Transaction',
   components: {
     LoadingSpinner,
     Unlock
   },
  data () {
    return {
      loading: false,
      loadingText: 'loading...',
      visible: false,
      action: '',
      fields: {},
      ricardian: '',
      cancelable: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUnlocked: 'account/getUnlocked',
      getTokenContractRicardian: 'api/getTokenContractRicardian',
      getMainCurrencyContractAbi: 'api/getMainCurrencyContractAbi',
      getUsesScatter: 'account/getUsesScatter'
    })
  },
  methods: {
    //
    // needs rewrite for all contarct abis
    //
    async newTransaction (action, fields, cancelable) {
      if (cancelable) {
        this.cancelable = cancelable
      }
      this.visible = true
      this.loading = true
      this.loadingText = 'Loading ABI...'
      let ricardian
      switch(action) {
        case 'transferMain':
          if (!this.getMainCurrencyContractAbi) {
            ricardian = await this.$store.dispatch('api/getContractRicardian', this.$configFile.network.mainCurrencyContract.name)
          } else {
            ricardian = this.getMainCurrencyContractAbi
          }
        break
        case 'transfer':
          if (!this.getTokenContractRicardian) {
            ricardian = await this.$store.dispatch('api/getContractRicardian', this.$configFile.network.tokenContract.name)
          } else {
            ricardian = this.getTokenContractRicardian
          }
        break
      }
      let ricardianAction = ricardian.find(ricardianAction => {
        return ricardianAction.name === action
      })
      let md = new MarkdownIt()
      this.ricardian = md.render(ricardianAction.ricardian_contract)
      this.action = action
      this.fields = fields
      this.loading = false
    },
    transact () {
      if (this.getUsesScatter) {
        this.loading = true
        this.loadingText = 'Pushing Transaction...'
        this.$store.dispatch('api/' + this.action, {data: this.fields, scatter: true}).then((res) => {
            this.$emit('done')
            this.visible = false
            this.$store.commit('api/NOTIFY', {icon: 'icon-tick', color:'positive', message:'Transaction Successful', detail: ''})
          this.loading = false
        }, (err) => {
          if (err.type) {
            this.$store.commit('api/NOTIFY', {icon: 'error', color:'red', message:'Error: ' + err.type, detail: ''})
          } else {
            this.$store.commit('api/NOTIFY', {icon: 'error', color:'red', message:'Error: ' + JSON.parse(err).error.details[0].message, detail: ''})
          }
          this.loading = false
        })
      } else {
        if (this.getUnlocked) {
          this.loading = true
          this.loadingText = 'Pushing Transaction...'
          this.$store.dispatch('api/' + this.action, {data: this.fields, scatter: false}).then((res) => {
            this.$emit('done')
            this.visible = false
            this.$store.commit('api/NOTIFY', {icon: 'icon-tick', color:'positive', message:'Transaction Successful', detail: ''})
            this.loading = false
          }, (err) => {
            this.$store.commit('api/NOTIFY', {icon: 'error', color:'red', message:'Error: ' + err.message, detail: ''})
            this.loading = false
          })
        } else {
          this.$refs.Unlock.open()
        }
      }
    }
  }
}
</script>

<style>
.ricardian {
  padding: 25px;
  width: auto;
  min-width: 0;
}
</style>
