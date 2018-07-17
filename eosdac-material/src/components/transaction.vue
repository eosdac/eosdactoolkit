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
            <q-btn v-if="cancelable" color="danger" @click="visible = false">Cancel</q-btn>
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
      cancelable: true
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUnlocked: 'account/getUnlocked',
      getAbiActions: 'api/getAbiActions',
      getUsesScatter: 'account/getUsesScatter'
    })
  },
  methods: {
    newTransaction (action, fields, cancelable) {
      if (cancelable) {
        this.cancelable = false
      }
      this.visible = true
      this.loading = true
      this.loadingText = 'Loading ABI...'
      if (!this.getAbiActions) {
        this.$store.dispatch('api/getTokenContractAbi').then((res) => {
        this.loading = false
        let abiAction = this.getAbiActions.find(abiAction => {
          return abiAction.name === action
        })
        if (abiAction) {
        let md = new MarkdownIt()
        this.ricardian = md.render(abiAction.ricardian_contract)
        this.action = action
        this.fields = fields
        }
        }, (err) => {
          this.loading = false
        })
      } else {
        this.loading = false
        let abiAction = this.getAbiActions.find(abiAction => {
          return abiAction.name === action
        })
        if (abiAction) {
        let md = new MarkdownIt()
        this.ricardian = md.render(abiAction.ricardian_contract)
        }
        this.action = action
        this.fields = fields
      }

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
          this.$store.commit('api/NOTIFY', {icon: 'error', color:'red', message:'Error: ' + err.message, detail: ''})
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
