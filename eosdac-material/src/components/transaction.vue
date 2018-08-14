<template>
<q-modal class="text-white z-max" v-model="visible" :content-css="{maxWidth: '30vw'}">
  <q-card dark class="bg-dark">
    <q-card-title>
      <div class="q-title">Transaction</div>
    </q-card-title>
    <q-list dark>
      <q-item>
        <q-item-main label="Action" />
        <q-item-side right>
          {{action}}
        </q-item-side>
      </q-item>
    </q-list>
    <q-list dark striped>
      <q-list-header>Fields</q-list-header>
      <q-item v-for="(field, key) in fields" :key="key">
        <q-item-main :label="key + ':'" />
        <q-item-side right>
          {{field}}
        </q-item-side>
      </q-item>
    </q-list>
    <q-alert :message="ricardianError? ricardianErrorText : 'By completing this transaction, I agree to the following terms.'" class="text-truncate" :text-color="ricardianError? 'black' : 'white'" :icon="ricardianError? 'info' : 'icon-ui-6'" :color="ricardianError? 'warning' : 'primary'" />
    <div v-html="ricardian" class="markdown-body ricardian q-pa-md">
    </div>
    <q-card-actions>
      <q-btn color="primary" @click="transact()">Send</q-btn>
      <q-btn v-if="!cancelable" color="danger" @click="close()">Cancel</q-btn>
    </q-card-actions>
    <LoadingSpinner :visible="loading" :text="loadingText" />
  </q-card>
  <Unlock ref="Unlock" />
</q-modal>
</template>

<script>
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
import Unlock from 'components/unlock'
export default {
  name: 'Transaction',
  components: {
    LoadingSpinner,
    Unlock
  },
  data() {
    return {
      loading: false,
      loadingText: 'loading...',
      visible: false,
      action: '',
      fields: {},
      ricardian: '',
      cancelable: false,
      ricardianErrorText: 'The ricardian contract for this action could not be found. Are you sure you want to execute this transaction?',
      ricardianError: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUnlocked: 'account/getUnlocked',
      getTokenContractRicardian: 'api/getTokenContractRicardian',
      getMainCurrencyContractRicardian: 'api/getMainCurrencyContractRicardian',
      getUsesScatter: 'account/getUsesScatter'
    })
  },
  methods: {
    async newTransaction(action, fields, cancelable) {
      Object.assign(this.$data, this.$options.data())
      if (cancelable) {
        this.cancelable = cancelable
      }
      this.visible = true
      this.loading = true
      this.loadingText = 'Loading ABI...'
      this.action = action
      this.fields = fields
      let ricardian = await this.getRic(action)
      if (ricardian) {
        let ricardianAction = ricardian.find(ricardianAction => {
          return ricardianAction.name === action
        })
        if (ricardianAction) {
          let md = new MarkdownIt()
          let ric = md.render(ricardianAction.ricardian_contract)
          let vars = ric.match(/\{{.*?\}}/g)
          let varArray = Object.assign({}, fields)
          varArray[action] = action
          if (vars) {
            for (let i = 0; i < vars.length; i++) {
              ric = ric.replace(vars[i], '<b><u>' + varArray[vars[i].replace(/\W/g, '')] + '</u></b>')
            }
          }
          ric = ric.substring(ric.indexOf('INTENT:') + 17, ric.indexOf('TERM:'))
          this.ricardian = ric
        } else {
          this.ricardianError = true
        }
      } else { // ricardian action doesnt exist
        this.ricardianError = true
      }
      this.loading = false

    },
    close () {
      Object.assign(this.$data, this.$options.data())
      this.visible = false
    },
    async getRic(action) {
      try {
        let ricardian
        switch (action) {
          case 'transferMain':
            ricardian = (!this.getMainCurrencyContractRicardian) ? await this.$store.dispatch('api/getContractRicardian', this.$configFile.network.mainCurrencyContract.name) : this.getMainCurrencyContractRicardian
            break
          case 'transfer':
            ricardian = (!this.getTokenContractRicardian) ? await this.$store.dispatch('api/getContractRicardian', this.$configFile.network.tokenContract.name) : this.getTokenContractRicardian
            break
          case 'memberreg':
            ricardian = (!this.getTokenContractRicardian) ? await this.$store.dispatch('api/getContractRicardian', this.$configFile.network.tokenContract.name) : this.getTokenContractRicardian
            break
        }
        return ricardian
      } catch (err) {
        throw err
      }
    },
    transact() {
      if (this.getUsesScatter) {
        this.loading = true
        this.loadingText = 'Pushing Transaction...'
        this.$store.dispatch('api/' + this.action, {
          data: this.fields,
          scatter: true
        }).then((res) => {
          this.$emit('done')
          if (this.action !== 'transfer') {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'Transaction Successful',
              details: res.transaction_id,
              linkText: 'View in explorer',
              linkUrl: this.$configFile.api.mainCurrencyExplorerUrl + '/transaction/' + res.transaction_id
            })
          } else {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'Transaction Successful',
              details: res.transaction_id,
              linkText: 'View in explorer',
              linkUrl:  res.transaction_id
            })
          }
          this.loading = false
          this.close()
        }, (err) => {
          if (err.type) {
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + err.type,
              detail: ''
            })
          } else {
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + JSON.parse(err).error.details[0].message,
              detail: ''
            })
          }
          this.loading = false
        })
      } else {
        if (this.getAccountName) {
          this.loading = true
          this.loadingText = 'Pushing Transaction...'
          this.$store.dispatch('api/' + this.action, {
            data: this.fields,
            scatter: false
          }).then((res) => {
            this.$emit('done')
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'Transaction Successful',
              details: res
            })
            this.loading = false
            this.close()
          }, (err) => {
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + err.message,
              details: ''
            })
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
