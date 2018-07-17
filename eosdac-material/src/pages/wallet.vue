<template>
<q-page class="text-white q-pa-md">

  <div class="row">
    <div class="col-xs-12 col-sm-12 col-md-8">
      <h4 class="q-display-1 q-mt-none q-mb-md">Wallet</h4>
      <q-tabs align="justify">
        <q-tab default slot="title" name="tab-1" icon="icon-logo-eosdac" :label="tokenName" />
        <q-tab slot="title" name="tab-2" icon="icon-eos" label="EOS" />
        <q-tab-pane name="tab-1">
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-4">
              <q-card dark flat class="bg-dark2 q-ma-sm">
                <q-card-main>
                  <h6 class="text-center q-ma-none">{{tokenBalance}} {{tokenName}}</h6>
                </q-card-main>
                <q-card-actions>
                </q-card-actions>
              </q-card>
              <q-card dark flat class="bg-dark2 q-ma-sm">
                <q-card-title>
                  <h5 class="q-ma-none">Contacts</h5>
                </q-card-title>
                <q-card-main>
                  <q-list dark>
                    <q-item>
                      <q-item-main label="someaccount" />
                    </q-item>
                    <q-item>
                      <q-item-main label="someaccount" />
                    </q-item>
                  </q-list>
                </q-card-main>
                <q-card-actions>
                </q-card-actions>
              </q-card>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-8">
              <q-card dark flat class="bg-dark2 q-ma-sm">
                <q-card-title>
                  <h5 class="q-ma-none">Transfer</h5>
                </q-card-title>
                <q-card-main>
                  <q-field class="q-mb-md" icon="icon-member" label="Transfer to" :error="transferToError" :error-label="transferToErrorText">
                    <q-input dark v-model="transferTo" />
                  </q-field>
                  <q-field class="q-mb-md" icon="icon-dac-balance" label="Amount" :error="transferAmountError" :error-label="transferAmountErrorText">
                    <q-input v-model="transferAmount" type="number" :decimals="transferAmountDecimals" dark />
                  </q-field>
                  <q-field inset="icon" class="q-mb-md" label="Memo">
                    <q-input rows="7" type="textarea" v-model="transferMemo" dark />
                  </q-field>
                </q-card-main>
                <q-card-actions class="justify-end">
                  <q-btn @click="transfer()" :disabled="badTransfer" class="q-ma-sm" color="primary" label="Transfer" size="xl" />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-tab-pane>
        <q-tab-pane name="tab-2">Tab Two</q-tab-pane>
      </q-tabs>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-4">
      <h4 class="q-display-1 q-mt-none q-mb-md">History</h4>
    </div>
  </div>
  </div>
  <Transaction ref="Transaction" v-on:done="transfered()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Wallet',
  components: {
    Transaction,
    LoadingSpinner
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      tokenBalance: 0,
      tokenName: '',
      eosBalance: 0,
      transferToError: false,
      transferToErrorText: '',
      transferTo: '',
      transferAmountError: false,
      transferAmountErrorText: '',
      transferAmount: 0,
      transferAmountDecimals: 0,
      transferMemo: '',
      badTransfer: true,
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getUnlocked: 'account/getUnlocked',
    })
  },
  mounted() {
    this.transferAmountDecimals = this.$configFile.network.tokenContract.decimals
    this.lookupBalance()
  },
  methods: {
    transfer() {
      this.$refs.Transaction.newTransaction('transfer', {
        from: this.getAccountName,
        to: this.transferTo,
        quantity: this.transferAmount.toFixed(this.$configFile.network.tokenContract.decimals) + ' ' + this.tokenName,
        memo: this.transferMemo
      })
    },
    lookupBalance() {
      this.$store.dispatch('api/getTokenContractBalance', {
        account: this.getAccountName
      }).then((res) => {
        this.balances = res.rows
        if (res.rows) {
          for (let i = 0; i < res.rows.length; i++) {
            let value = parseFloat(res.rows[i].balance)
            let label = res.rows[i].balance.replace(/[^a-z]/gi, '')
            if (label === this.$configFile.network.tokenContract.token) {
              this.tokenBalance = value
              this.tokenName = this.$configFile.network.tokenContract.token
            }
          }
        }
      }, (err) => {
        console.log(err)
      })
    }
  },
  watch: {
    transferTo(val) {
      if (!val) {
        this.transferToError = false
        this.transferToErrorText = ''
        this.badTransfer = true
      } else if (!/(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)/.test(val)) {
        this.transferToError = true
        this.transferToErrorText = 'Invalid account name'
        this.badTransfer = true
      } else {
        this.transferToError = false
        this.transferToErrorText = ''
        this.badTransfer = false
      }
    }
  }
}
</script>

<style>
</style>
