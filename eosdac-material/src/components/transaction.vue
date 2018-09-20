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
      <q-item v-for="(field, key) in fields" :key="key" v-if="String(field).length < 20">
        <q-item-main :label="key + ':'" />
        <q-item-side right>
          {{field}}
        </q-item-side>
      </q-item>
      <q-item v-else>
        <div class="q-item-label">{{key + ':'}}</div>
          <q-scroll-area class="bg-dark2 q-ml-sm" style="width: 95%; height: 80px;">
            <p class="no-margin q-pa-sm" style="word-break: break-all;">{{field}}</p>
        </q-scroll-area>

      </q-item>
    </q-list>
    <q-alert v-if="getAccountResources.cpu.warning" :message="$t('transaction.warning_cpu')" class="text-truncate" text-color="black" icon="icon-ui-9" color="warning" />
    <q-alert v-if="getAccountResources.ram.warning" :message="$t('transaction.warning_ram')" class="text-truncate" text-color="black" icon="icon-type-8" color="warning" />
    <q-alert v-if="getAccountResources.net.warning" :message="$t('transaction.warning_bandwidth')" class="text-truncate" text-color="black" icon="icon-ui-10" color="warning" />
    <q-alert :message="ricardianError? $t(ricardianErrorText) : $t('transaction.by_completing_agree')" class="text-truncate" :text-color="ricardianError? 'black' : 'white'" :icon="ricardianError? 'info' : 'icon-ui-6'" :color="ricardianError? 'warning' : 'primary'"
    />
    <q-scroll-area v-if="ricardian" style="height:150px;">
      <div v-html="ricardian" class="markdown-body ricardian q-pa-md">
      </div>
    </q-scroll-area>
    <div class="relative-position q-pa-sm">
      <q-btn color="primary" @click="transact()">{{ $t('transaction.send') }}</q-btn>
      <q-btn class="on-right" v-if="!cancelable" color="negative" @click="close()">{{ $t('transaction.cancel') }}</q-btn>
    </div>
    <LoadingSpinner :visible="loading" :text="$t(loadingText)" />
  </q-card>
</q-modal>
</template>

<script>
import marked from 'marked'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Transaction',
  components: {
    LoadingSpinner
  },
  data() {
    return {
      loading: false,
      loadingText: 'initialize.loading_text',
      visible: false,
      action: '',
      fields: {},
      contract: '',
      ricardian: '',
      cancelable: false,
      ricardianErrorText: 'transaction.warning_ricardian',
      ricardianError: false
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUsesScatter: 'account/getUsesScatter',
      getAccountResources: 'account/getAccountResources',
      getRicardians: 'api/getRicardians',
      getTransactionPopup: 'usersettings/getTransactionPopup'
    })
  },

  methods: {
    async newTransaction(contract, action, fields, cancelable) {
      Object.assign(this.$data, this.$options.data())
      this.cancelable = cancelable
      this.visible = this.getTransactionPopup //boolean
      this.loading = this.getTransactionPopup //boolean
      this.loadingText = 'transaction.loading_abi'
      this.action = action
      this.fields = fields
      this.contract = contract
      console.log(this.contract, this.action)
      if (!this.getTransactionPopup) {
        this.transact();
        return false;

      }
      let ricardian = []
      if (this.getRicardians[this.contract]) {
        ricardian = this.getRicardians[this.contract]
      } else {
        ricardian = await this.$store.dispatch('api/getContractRicardian', this.contract)
      }
      let ricardianAction = ricardian.find(ricardianAction => {
        return ricardianAction.name === this.action
      })
      if (ricardianAction && ricardianAction.ricardian_contract) {
        let ric = marked(ricardianAction.ricardian_contract, {sanitize: true})
        this.replaceVars(ric)
      } else {
        this.ricardianError = true
      }
      this.loading = false
    },
    replaceVars(ric) {
      let findVars = ric.match(/\{{.*?\}}/g)
      let varArray = Object.assign({}, this.fields)
      varArray[this.action] = this.action
      if (this.contract === this.$configFile.network.mainCurrencyContract.name) {
        varArray['transactiondelay'] = 0
      }
      if (findVars) {
        for (let i = 0; i < findVars.length; i++) {
          ric = ric.replace(findVars[i], '<b><u>' + varArray[findVars[i].replace(/\W/g, '')] + '</u></b>')
        }
      }
      if (this.contract !== this.$configFile.network.mainCurrencyContract.name) {
        ric = ric.substring(ric.indexOf('INTENT:') + 17, ric.indexOf('TERM:'))
      }
      this.ricardian = ric
    },
    close() {
      Object.assign(this.$data, this.$options.data())
      this.visible = false
    },
    transact() {
      if (this.getUsesScatter) {
        this.loading = true
        this.loadingText = 'transaction.pushing_transaction'
        this.$store.dispatch('api/transaction', {
          action: this.action,
          data: this.fields,
          scatter: true,
          contract: this.contract
        }).then((res) => {
          this.$emit('done')
          if (this.action !== 'transfer') {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'transaction.transaction_successful',
              details: res.transaction_id,
              linkText: 'transaction.view_in_explorer',
              linkUrl: this.$configFile.api.mainCurrencyExplorerUrl + '/transaction/' + res.transaction_id,
              autoclose: 10
            })
          } else {
            this.$store.commit('api/NOTIFY', {
              icon: 'icon-ui-6',
              color: 'positive',
              message: 'transaction.transaction_successful',
              details: res.transaction_id,
              linkText: 'transaction.view_in_explorer',
              linkUrl: this.$configFile.api.tokenExplorerUrl + '/transaction/' + res.transaction_id,
              autoclose: 10
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
              detail: '',
              autoclose: 10
            })
          } else {
            console.log(err)
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + JSON.parse(err).error.details[0].message || JSON.parse(err),
              detail: '',
              autoclose: 10
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
