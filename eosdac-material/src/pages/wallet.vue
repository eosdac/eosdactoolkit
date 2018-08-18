<template>
<q-page class="text-white q-pa-md">
  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-8">
      <div class="row">
        <div class="col-xs-12">
          <h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("wallet.wallet") }}</h4>
          <q-tabs align="justify">
            <q-tab default slot="title" :name="tokenName" icon="icon-dac-balance" :label="tokenName" />
            <q-tab slot="title" :name="mainCurrencyName" icon="icon-type-2" :label="mainCurrencyName" />
            <q-tab-pane :name="tokenName">
              <div class="row">
                <div class="col-lg-12 col-xl-4">
                  <q-card dark flat class="bg-dark2 q-ma-sm">
                    <q-card-main>
                      <h6 class="text-center q-ma-none">{{getTokenBalance}} {{tokenName}}</h6>
                    </q-card-main>
                    <q-card-actions>
                    </q-card-actions>
                  </q-card>
                </div>
                <div class="col-lg-12 col-xl-8">
                  <q-card dark flat class="bg-dark2 q-ma-sm">
                    <q-card-title>
                      <h5 class="q-ma-none">{{ $t('wallet.transfer') }}</h5>
                    </q-card-title>
                    <q-card-main>
                      <q-field class="q-mb-md" icon="icon-topmenu-2" :label="$t('wallet.transfer_to')" :error="transferToError" :error-label="transferToErrorText">
                        <q-input dark v-model="transferTo" />
                      </q-field>
                      <q-field class="q-mb-md" icon="icon-dac-balance" :label="$t('wallet.amount')" :error="transferAmountError" :error-label="transferAmountErrorText">
                        <q-input v-model="transferAmount" :suffix="tokenName" type="number" :decimals="transferAmountDecimals" dark />
                      </q-field>
                      <q-field inset="icon" class="q-mb-md" label="Memo">
                        <q-input rows="3" type="textarea" v-model="transferMemo" dark />
                      </q-field>
                    </q-card-main>
                    <q-card-actions class="justify-end">
                      <q-btn @click="transferToken()" :disabled="badTransferTo || badTransferAmount" class="q-ma-sm" color="primary" :label="$t('wallet.transfer')"/>
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </q-tab-pane>
            <q-tab-pane :name="mainCurrencyName">
              <div class="row">
                <div class="col-lg-12 col-xl-4">
                  <q-card dark flat class="bg-dark2 q-ma-sm">
                    <q-card-main>
                      <h6 class="text-center q-ma-none">{{getMainCurrencyBalance}} {{mainCurrencyName}}</h6>
                    </q-card-main>
                    <q-card-actions>
                    </q-card-actions>
                  </q-card>
                </div>
                <div class="col-lg-12 col-xl-8">
                  <q-card dark flat class="bg-dark2 q-ma-sm">
                    <q-card-title>
                      <h5 class="q-ma-none">{{ $t("wallet.transfer") }}</h5>
                    </q-card-title>
                    <q-card-main>
                      <q-field class="q-mb-md" icon="icon-topmenu-2" :label="$t('wallet.transfer_to')" :error="transferToError" :error-label="transferToErrorText">
                        <q-input dark v-model="transferTo" />
                      </q-field>
                      <q-field class="q-mb-md" icon="icon-type-2" :label="$t('wallet.amount')" :error="transferAmountErrorText" :error-label="transferMainAmountErrorText">
                        <q-input v-model="transferMainAmount" :suffix="mainCurrencyName" type="number" :decimals="transferMainAmountDecimals" dark />
                      </q-field>
                      <q-field inset="icon" class="q-mb-md" :label="$t('wallet.memo')">
                        <q-input rows="3" type="textarea" v-model="transferMemo" dark />
                      </q-field>
                    </q-card-main>
                    <q-card-actions class="justify-end">
                      <q-btn @click="transferMainCurrency()" :disabled="badTransferTo || badTransferMainAmount" class="q-ma-sm" color="primary" :label="$t('wallet.transfer')" />
                    </q-card-actions>
                  </q-card>
                </div>
              </div>
            </q-tab-pane>
          </q-tabs>
        </div>
        <div v-if="getAccountResources.ram" class="col-lg-12 col-xl-4 q-pa-sm">
          <q-alert icon="icon-type-8" color="dark2">
            <h5 class="q-mb-sm q-mt-none">{{ $t("wallet.RAM") }}</h5>
  <q-progress color="white" :percentage="getAccountResources.ram.available" />
            <p class="text-center q-mt-sm">{{getAccountResources.ram.available}} % remaining</p>
          </q-alert>
        </div>
        <div v-if="getAccountResources.cpu" class="col-lg-12 col-xl-4 q-pa-sm">
          <q-alert icon="icon-ui-9" color="dark2">
            <h5 class="q-mb-sm q-mt-none">{{ $t("wallet.CPU") }}</h5>
  <q-progress color="white" :percentage="getAccountResources.cpu.available" />
            <p class="text-center q-mt-sm">{{getAccountResources.cpu.available}} % remaining</p>
          </q-alert>
        </div>
        <div v-if="getAccountResources.net" class="col-lg-12 col-xl-4 q-pa-sm">
          <q-alert icon="icon-ui-10" color="dark2">
            <h5 class="q-mb-sm q-mt-none">{{ $t("wallet.network") }}</h5>
  <q-progress color="white" :percentage="getAccountResources.net.available" />
            <p class="text-center q-mt-sm">{{getAccountResources.net.available}} % remaining</p>
          </q-alert>
        </div>
      </div>
    </div>
    <!--<div class="col-xs-12 col-sm-12 col-md-4 q-pl-md">
      <h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("wallet.history") }}</h4>
      <TransferHistory ref="History" />
    </div>-->
  </div>
  </div>
  <Transaction ref="Transaction" v-on:done="lookupTokenBalance()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
//import TransferHistory from 'components/transfer-history'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Wallet',
  components: {
    Transaction,
    LoadingSpinner
    //TransferHistory
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      tokenName: this.$configFile.network.tokenContract.token,
      mainCurrencyName: this.$configFile.network.mainCurrencyContract.token,
      transferToError: false,
      transferToErrorText: '',
      transferTo: '',
      transferAmountError: false,
      transferAmountErrorText: '',
      transferAmount: 0,
      transferAmountDecimals: this.$configFile.network.tokenContract.decimals,
      transferMainAmountError: false,
      transferMainAmountErrorText: '',
      transferMainAmount: 0,
      transferMainAmountDecimals: this.$configFile.network.mainCurrencyContract.decimals,
      transferMemo: '',
      badTransferAmount: true,
      badTransferMainAmount: true,
      badTransferTo: true
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getTokenBalance: 'account/getTokenBalance',
      getAccount: 'account/getAccount',
      getMainCurrencyBalance: 'account/getMainCurrencyBalance',
      getAccountResources: 'account/getAccountResources'
    })
  },
  mounted() {
    if (this.getAccountName) {
      this.lookupTokenBalance()
    }
  },
  methods: {
    transferToken() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.tokenContract.name, 'transfer', {
        from: this.getAccountName,
        to: this.transferTo,
        quantity: this.transferAmount.toFixed(this.$configFile.network.tokenContract.decimals) + ' ' + this.$configFile.network.tokenContract.token,
        memo: this.transferMemo
      })
    },
    transferMainCurrency() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.mainCurrencyContract.name, 'transferMain', {
        from: this.getAccountName,
        to: this.transferTo,
        quantity: this.transferMainAmount.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
        memo: this.transferMemo
      })
    },
    async lookupTokenBalance() {
      try {
        this.loading = true
        this.loadingText = 'Looking up balances...'
        const balance = this.$store.dispatch('api/getTokenContractBalance')
        const mainBalance = this.$store.dispatch('api/getMainCurrencyBalance')
        const acc = this.$store.dispatch('api/updateAccountInfo')
        let race = await Promise.race( [balance, mainBalance, acc] )
        this.loading = false
      } catch (err) {
        this.loading = false
        this.$store.commit('api/NOTIFY', {
          icon: 'error',
          color: 'red',
          message: 'Error: ' + err.message,
          detail: ''
        })
      }
    }
  },
  watch: {
    transferAmount(val) {
      if (val > this.getTokenBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
        this.transferAmountError = true
        this.transferAmountErrorText = 'Invalid amount'
        this.badTransferAmount = true
      } else {
        this.transferAmountError = false
        this.badTransferAmount = false
      }
    },
    transferMainAmount(val) {
      if (val > this.getMainCurrencyBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
        this.transferMainAmountError = true
        this.transferMainAmountErrorText = 'Invalid amount'
        this.badTransferMainAmount = true
      } else {
        this.transferMainAmountError = false
        this.badTransferMainAmount = false
      }
    },
    transferTo(val) {
      if (!val || !/(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(val)) {
        this.transferToError = true
        this.transferToErrorText = 'Invalid account name'
        this.badTransferTo = true
      } else {
        this.transferToError = false
        this.transferToErrorText = ''
        this.badTransferTo = false
      }
    }
  }
}
</script>

<style>
</style>
