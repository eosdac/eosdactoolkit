<template>
<div>
<q-modal class="text-white z-max" v-model="visible" :content-css="{maxWidth: '30vw'}">
  <q-card v-for="(action, index) in actions" :key="index" v-show="index === showAction" dark class="bg-dark">
    <q-card-title>
      <div class="q-title q-mb-sm">{{ $t('transaction.transaction') }} ({{showAction +1}} / {{actions.length}})</div>
      <q-btn size="sm" v-if="showAction" class="float-left" color="primary" @click="showAction--">{{ $t('transaction.previous_action') }}</q-btn>
      <q-btn size="sm" v-if="index + 1 < actions.length" class="float-right" color="primary" @click="showAction++">{{ $t('transaction.next_action') }}</q-btn>
    </q-card-title>
    <q-list dark>
      <q-item>
        <q-item-main :label="$t('transaction.action')" />
        <q-item-side right>
          {{action.action}}
        </q-item-side>
      </q-item>
    </q-list>
    <q-list dark striped>
      <q-list-header>{{ $t('transaction.fields') }}</q-list-header>
      <q-item v-for="(field, key) in action.fields" :key="key" v-if="String(field).length < 20">
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
    <q-alert :message="action.ricardianError? $t(ricardianErrorText) : $t('transaction.by_completing_agree')" class="text-truncate" :text-color="action.ricardianError? 'black' : 'white'" :icon="action.ricardianError? 'info' : 'icon-ui-6'" :color="action.ricardianError? 'warning' : 'primary'" />
    <q-scroll-area v-if="action.ricardian && !action.ricardianError" style="height:150px;">
      <div v-html="action.ricardian" class="markdown-body ricardian q-pa-md">
      </div>
    </q-scroll-area>
    <div class="relative-position q-pa-sm">
      <q-btn color="primary" @click="transact()">{{ $t('transaction.send') }}</q-btn>
      <q-btn class="on-right" v-if="!cancelable" color="negative" @click="close()">{{ $t('transaction.cancel') }}</q-btn>

    </div>
    
    
  </q-card>
</q-modal>
<LoadingSpinner :visible="loading" :text="$t(loadingText)" />
</div>

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
      actions: [],
      add_abicache: false,
      callbackeventparameter:null,
      showAction: 0,
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

    close() {
      Object.assign(this.$data, this.$options.data())
      this.visible = false
    },
    async newTransaction(transactionActions, cancelable = false, abicache=false, callbackeventparameter = null) {
      if(!this.getAccountName){
        this.$root.$emit("showScatterModal");
        // alert('please sign in')
        return false;
      }
      
      Object.assign(this.$data, this.$options.data());
      this.add_abicache = abicache;
      this.callbackeventparameter = callbackeventparameter;
      // console.log('transaction comp abi cache', abicache, this.add_abicache)
      this.cancelable = cancelable
      this.visible = this.getTransactionPopup //boolean
      this.loading = this.getTransactionPopup //this.getTransactionPopup //boolean

      if(this.getTransactionPopup){
        this.loadingText = 'transaction.loading_abi'
        for (let i = 0; i < transactionActions.length; i++) {
          if (this.getRicardians[transactionActions[i].contract]) {
            transactionActions[i].ricardian = this.getRicardians[transactionActions[i].contract]
          } else {
            transactionActions[i].ricardian = await this.$store.dispatch('api/getContractRicardian', transactionActions[i].contract)
          }
          let ricardianAction = transactionActions[i].ricardian.find(ricardianAction => {
            return ricardianAction.name === transactionActions[i].action
          })
          if (ricardianAction && ricardianAction.ricardian_contract) {
            transactionActions[i].ricardian = marked(ricardianAction.ricardian_contract, {
              sanitize: true
            })
            transactionActions[i].ricardian = this.replaceVars(transactionActions[i].ricardian, transactionActions[i].fields, transactionActions[i].action, transactionActions[i].contract)
          } else {
            transactionActions[i].ricardianError = true
          }
        }
      }


      this.actions = transactionActions
      if(!this.getTransactionPopup){
        this.transact();
      }else{
        this.loading = false
      }
      
    },
    replaceVars(ric, fields, action, contract) {
      let findVars = ric.match(/\{{.*?\}}/g)
      let varArray = Object.assign({}, fields)
      varArray[action] = action
      if (contract === this.$configFile.network.mainCurrencyContract.name) {
        varArray['transactiondelay'] = 0
      }
      if (findVars) {
        for (let i = 0; i < findVars.length; i++) {
          ric = ric.replace(findVars[i], '<b><u>' + varArray[findVars[i].replace(/\W/g, '')] + '</u></b>')
        }
      }
      if (contract !== this.$configFile.network.mainCurrencyContract.name) {
        ric = ric.substring(ric.indexOf('INTENT:') + 17, ric.indexOf('TERM:'))
      }
      return ric
    },
     async transact() {
      this.loading = true
      this.loadingText = 'transaction.pushing_transaction'
      try {
        // console.log('transact comp abi cache', this.add_abicache)
        let trx = await this.$store.dispatch('api/transaction', {actions: this.actions, scatter: this.getUsesScatter, add_abicache: this.add_abicache})
        this.$store.commit('api/NOTIFY', {
          icon: 'icon-ui-6',
          color: 'positive',
          message: this.$t('transaction.transaction_successful'),
          details: trx.transaction_id,
          linkText: this.$t('transaction.view_in_explorer'),
          linkUrl: this.$configFile.external.mainCurrencyExplorerUrl + '/transaction/' + trx.transaction_id,
          autoclose: 10
        })
        this.$emit('done', this.callbackeventparameter);
        this.close()
      } catch (err) {
        // console.log(err)
        
        if (err.type) {
          let msg = err.type == 'signature_rejected' ? this.$t('transaction.signature_rejected') : err.type;
          this.$store.commit('api/NOTIFY', {
            icon: 'error',
            color: 'red',
            message: this.$t('transaction.error')+': ' + msg,
            detail: '',
            autoclose: 10
          })
        } else {
          console.log(err)
          this.$store.commit('api/NOTIFY', {
            icon: 'error',
            color: 'red',
            // message: 'Error: ' + JSON.parse(err).error.details[0].message || JSON.parse(err),
            message: this.$t('transaction.error')+': ' +this.parseError(err),
            detail: '',
            autoclose: 10
          })
        }
      } finally {
        this.loading = false
      }
    },
    
    parseError(err){
      // example error: assertion failure with message: ERR::UNSTAKE_CANNOT_UNSTAKE_FROM_ACTIVE_CAND::Cannot unstake tokens for an active candidate. Call withdrawcand first.
      // console.log(err)
      err = JSON.parse(err);
      if(err.error.details[0].message && err.error.details[0].message.indexOf('ERR::') > -1){
        err = err.error.details[0].message.substr(err.error.details[0].message.indexOf('ERR::'));
        let t = 'contract_errors.'+err.split('::')[1];
        err = this.$t(t);
      }
      else{
        err = err.error.details[0].message;
      }
      return err;

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
