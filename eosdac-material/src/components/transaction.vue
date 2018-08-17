<template>
<q-modal class="text-white z-max" v-model="visible" :content-css="{maxWidth: '30vw'}">
  <q-card dark class="bg-dark">
    <q-card-title>
      <div class="q-title">{{ $t('transaction.transaction') }}</div>
    </q-card-title>
    <q-list dark>
      <q-item>
        <q-item-main :label="$t('transaction.action')" />
        <q-item-side right>
          {{action}}
        </q-item-side>
      </q-item>
    </q-list>
    <q-list dark striped>
      <q-list-header>{{ $t('transaction.fields') }}</q-list-header>
      <q-item v-for="(field, key) in fields" :key="key">
        <q-item-main :label="$t('transaction.'+key) + ':'" />
        <q-item-side right>
          {{field}}
        </q-item-side>
      </q-item>
    </q-list>
    <q-alert v-if="getAccountResources.cpu.warning" :message="$t('transaction.warning_cpu')" class="text-truncate" text-color="black" icon="icon-ui-9" color="warning" />
    <q-alert v-if="getAccountResources.ram.warning" :message="$t('transaction.warning_ram')" class="text-truncate" text-color="black" icon="icon-type-8" color="warning" />
    <q-alert v-if="getAccountResources.net.warning" :message="$t('transaction.warning_bandwidth')" class="text-truncate" text-color="black" icon="icon-ui-10" color="warning" />
    <q-alert :message="ricardianError? $t(ricardianErrorText) : $t('transaction.by_completing_agree')" class="text-truncate" :text-color="ricardianError? 'black' : 'white'" :icon="ricardianError? 'info' : 'icon-ui-6'" :color="ricardianError? 'warning' : 'primary'" />
    <div v-html="ricardian" class="markdown-body ricardian q-pa-md">
    </div>
    <q-card-actions>
      <q-btn color="primary" @click="transact()">Send</q-btn>
      <q-btn v-if="!cancelable" color="danger" @click="close()">{{ $t('transaction.cancel') }}</q-btn>
    </q-card-actions>
    <LoadingSpinner :visible="loading" :text="$t(loadingText)" />
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
      loadingText: 'initialize.loading_text',
      visible: false,
      action: '',
      fields: {},
      ricardian: '',
      cancelable: false,
      ricardianErrorText: 'transaction.warning_ricardian',
      ricardianError: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getTokenContractRicardian: 'api/getTokenContractRicardian',
      getMainCurrencyContractRicardian: 'api/getMainCurrencyContractRicardian',
      getUsesScatter: 'account/getUsesScatter',
      getAccountResources: 'account/getAccountResources'
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
      this.loadingText = 'transaction.loading_abi'
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
          case 'memberunreg':
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
        this.loadingText = 'transaction.pushing_transaction'
        this.$store.dispatch('api/' + this.action, {
          data: this.fields,
          scatter: true
        }).then((res) => {
          this.$emit('done')
          if (this.action !== 'transfer') {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'transaction.transaction_successful',
              details: res.transaction_id,
              linkText: 'View in explorer',
              linkUrl: this.$configFile.api.mainCurrencyExplorerUrl + '/transaction/' + res.transaction_id
            })
          } else {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'transaction.transaction_successful',
              details: res.transaction_id,
              linkText: 'transaction.view_in_explorer',
              linkUrl:  this.$configFile.api.tokenExplorerUrl + '/transaction/' + res.transaction_id
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
              message: 'Error: ' + JSON.parse(err).error.details[0].message || JSON.parse(err),
              detail: ''
            })
          }
          this.loading = false
        })
      } else {
        if (this.getAccountName) {
          this.loading = true
          this.loadingText = 'transaction.pushing_transaction'
          this.$store.dispatch('api/' + this.action, {
            data: this.fields,
            scatter: false
          }).then((res) => {
            this.$emit('done')
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'transaction.transaction_successful',
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
