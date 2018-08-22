<template>
<q-page class="relative-position" style="overflow-x: hidden;">
  <div class="gradient-bg-primary q-px-md q-pt-md">
    <div class="row">
      <div class="col-12">
        <h4 class="q-display-1 q-mb-sm q-mt-none">{{ $t("wallet.wallet") }}</h4>
      </div>
    </div>
    <div class="row gutter-md">
      <div class="col-lg-12 col-xl-4 relative-position">
        <span class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total_eos_balance") }}</span>
        <h4 class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{(getMainCurrencyBalance + getMainCurrencyStaked).toFixed(transferMainAmountDecimals)}}</span> {{mainCurrencyName}}</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-6">
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyStaked}} {{mainCurrencyName}}</span></p>
            </div>
            <div class="col-lg-12 col-xl-6">
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.liquid") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>
            </div>
          </div>
        </div>
        <q-card class="bg-dark2 absolute lg-hide md-hide sm-hide xs-hide" style="bottom:-55px; left:33px; width:94%;">
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon color="positive" style="font-size:50px;" name="icon-ui-13" />
              </q-item-tile>
            </q-item-side>
            <q-item-main class="q-pa-sm no-margin">
              <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.RAM") }}</span>
              <p class="no-margin q-pl-sm">{{getAccountResources.ram.available}} % remaining</p>
              <q-slider color="positive" readonly v-model="getAccountResources.ram.available" :min="0" :max="100" :step="1" />
            </q-item-main>
          </q-item>
        </q-card>
      </div>
      <div class="col-lg-12 col-xl-4 relative-position">
        <span class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total") }} {{tokenName}}</span>
        <h4 class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{getTokenBalance}}</span> {{tokenName}}</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-12"><!--12 bc only one for now-->
              <p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.liquid") }}</span><br><span class="uppercase q-title">{{getTokenBalance}} {{tokenName}}</span></p>
            </div>
            <div class="col-lg-12 col-xl-6">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
          </div>
        </div>
        <q-card class="bg-dark2 absolute lg-hide md-hide sm-hide xs-hide" style="bottom:-55px; left:33px; width:94%">
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon color="blue" style="font-size:50px;" name="icon-ui-9" />
              </q-item-tile>
            </q-item-side>
            <q-item-main class="q-pa-sm no-margin">
              <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.CPU") }}</span>
              <p class="no-margin q-pl-sm">{{getAccountResources.cpu.available}} % remaining</p>
              <q-slider color="blue" readonly v-model="getAccountResources.cpu.available" :min="0" :max="100" :step="1" label snap />
            </q-item-main>
          </q-item>
        </q-card>
      </div>
      <div class="col-lg-12 col-xl-4 relative-position">
        <span v-if="showValue" class="q-subheading text-dimwhite uppercase">{{ $t("wallet.total") }}</span>
        <span v-else class="q-subheading text-dimwhite uppercase">&zwnj;</span>
        <h4 v-if="showValue" class="q-my-sm text-no-wrap shrink_balance"><span class="text-weight-thin">{{total}}</span> USD</h4>
        <h4 v-else class="q-my-sm text-no-wrap shrink_balance">&zwnj;</h4>
        <div class="blur-details q-px-md q-py-md" style="min-height:120px;margin-right:-16px;margin-left:-16px;">
          <div class="row">
            <div class="col-lg-12 col-xl-6">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
            <div class="col-lg-12 col-xl-6">
              <!--<p class="q-subheading"><span class="text-dimwhite uppercase">{{ $t("wallet.total_staked") }}</span><br><span class="uppercase q-title">{{getMainCurrencyBalance}} {{mainCurrencyName}}</span></p>-->
            </div>
          </div>
        </div>
        <q-card class="bg-dark2 absolute lg-hide md-hide sm-hide xs-hide" style="bottom:-55px; left:33px; width:94%">
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon color="red" style="font-size:50px;" name="icon-ui-14" />
              </q-item-tile>
            </q-item-side>
            <q-item-main class="q-pa-sm no-margin">
              <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.network") }}</span>
              <p class="no-margin q-pl-sm">{{getAccountResources.net.available}} % remaining</p>
              <q-slider color="red" readonly v-model="getAccountResources.net.available" :min="0" :max="100" :step="0.001" label snap />
            </q-item-main>
          </q-item>
        </q-card>
      </div>
    </div>
  </div>

  <div class="row q-px-lg">
    <div class="col-12 xl-hide">
      <q-item>
        <q-item-side>
          <q-item-tile icon>
            <q-icon color="positive" style="font-size:50px;" name="icon-type-8" />
          </q-item-tile>
        </q-item-side>
        <q-item-main class="q-pa-sm no-margin">
          <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.RAM") }}</span>
          <p class="no-margin q-pl-sm">{{getAccountResources.ram.available}} % remaining</p>
          <q-slider color="positive" readonly v-model="getAccountResources.ram.available" :min="0" :max="100" :step="1" />
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-side>
          <q-item-tile icon>
            <q-icon color="blue" style="font-size:50px;" name="icon-ui-9" />
          </q-item-tile>
        </q-item-side>
        <q-item-main class="q-pa-sm no-margin">
          <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.CPU") }}</span>
          <p class="no-margin q-pl-sm">{{getAccountResources.cpu.available}} % remaining</p>
          <q-slider color="blue" readonly v-model="getAccountResources.cpu.available" :min="0" :max="100" :step="1" />
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-side>
          <q-item-tile icon>
            <q-icon color="red" style="font-size:50px;" name="icon-ui-10" />
          </q-item-tile>
        </q-item-side>
        <q-item-main class="q-pa-sm no-margin">
          <span class="q-subheading text-dimwhite uppercase q-pl-sm">{{ $t("wallet.network") }}</span>
          <p class="no-margin q-pl-sm">{{getAccountResources.net.available}} % remaining</p>
          <q-slider color="red" readonly v-model="getAccountResources.net.available" :min="0" :max="100" :step="1" />
        </q-item-main>
      </q-item>
    </div>
  </div>
  <div class="row q-mt-xl q-px-md md-hide sm-hide xs-hide">
    <div class="col-12 q-mt-lg">
      <h4 class="q-display-1 q-mb-sm q-mt-none text-weight-thin">{{ $t("wallet.send_tokens") }}</h4>
    </div>
  </div>
  <div class="row q-px-md lg-hide xl-hide">
    <div class="col-12">
      <h4 class="q-display-1 q-mb-sm q-mt-none text-weight-thin">{{ $t("wallet.send_tokens") }}</h4>
    </div>
  </div>
  <div class="row q-px-md">
    <div class="col-12 bg-dark2">
      <div class="row gutter-xs">
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.token_selection_and_quantity') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field class="q-mb-md" :label="$t('wallet.select_token_to_send')" label-width="12" dark>
                <q-select dark :placeholder="$t('wallet.select_from_list')" :options="[
                  { label: mainCurrencyName,  value: mainCurrencyName },
                  { label: tokenName, value: tokenName }
                ]" v-model="tokenSelection" />
              </q-field>
              <q-field :label="$t('wallet.quantity_to_send')" :error="transferAmountError" :error-label="transferAmountErrorText" label-width="12">
                <q-input :error="transferAmountError" placeholder="0.0000" v-model="transferAmount" type="number" :decimals="(tokenSelection === mainCurrencyName)?transferMainAmountDecimals : transferAmountDecimals" dark />
              </q-field>
            </q-card-main>
          </q-card>
        </div>
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.destination') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field class="q-mb-md" :label="$t('wallet.input_a_destination_account')" :error="transferToError" :error-label="transferToErrorText" label-width="12">
                <q-input :error="transferToError" dark v-model="transferTo" />
              </q-field>
              <!--<div class="row">
                <div class="col-lg-12 col-xl-8">
                  <q-field class="q-mb-md" :label="$t('wallet.or_select_address_book')" label-width="12" dark>
                    <q-select dark :placeholder="$t('wallet.select_from_list')" :options="[
                  { label: mainCurrencyName,  value: mainCurrencyName },
                  { label: tokenName, value: tokenName }
                ]" v-model="tokenSelection" />
                  </q-field>
                </div>
                <div class="col-lg-12 col-xl-4 text-right">
                  <q-btn no-caps dense class="q-mt-lg" flat color="p-light">{{ $t('wallet.manage_addressbook') }}</q-btn>
                </div>
              </div>-->
            </q-card-main>
          </q-card>
        </div>
        <div class="col-lg-12 col-xl-4">
          <q-card class="no-shadow">
            <q-card-title>
              <span class="q-title">{{ $t('wallet.memo') }}</span>
            </q-card-title>
            <q-card-main>
              <q-field dark label-width="12">
                <q-input inverted rows="8" color="dark" type="textarea" v-model="transferMemo" dark />
              </q-field>
            </q-card-main>
          </q-card>
        </div>
      </div>
      <div class="row q-pa-xs">
        <div class="col-12 relative-postition">
          <q-btn color="primary" @click="transfer()" :disabled="badTransferTo || transferAmountError" class="q-ma-md float-right no-shadow" :label="$t('wallet.transfer_tokens')" />
        </div>
      </div>
    </div>
  </div>
  <Transaction ref="Transaction" v-on:done="lookupTokenBalance()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
  <!--<div class="row">
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
                      <q-field class="q-mb-md" icon="icon-type-2" :label="$t('wallet.amount')" :error="transferMainAmountError" :error-label="transferMainAmountErrorText">
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
  </div>
  </div>
  <Transaction ref="Transaction" v-on:done="lookupTokenBalance()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />-->
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
    //TransferHistory
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      tokenSelection: '',
      tokenName: this.$configFile.network.tokenContract.token,
      mainCurrencyName: this.$configFile.network.mainCurrencyContract.token,
      transferTo: '',
      transferToError: false,
      transferToErrorText: '',
      transferAmount: 0,
      transferAmountError: false,
      transferAmountErrorText: '',
      transferAmountDecimals: this.$configFile.network.tokenContract.decimals,
      transferMainAmountError: false,
      transferMainAmountErrorText: '',
      transferMainAmount: 0,
      transferMainAmountDecimals: this.$configFile.network.mainCurrencyContract.decimals,
      transferMemo: '',
      badTransferAmount: true,
      badTransferMainAmount: true,
      badTransferTo: true,
      showValue: false,
      total: 0
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getTokenBalance: 'account/getTokenBalance',
      getAccount: 'account/getAccount',
      getMainCurrencyBalance: 'account/getMainCurrencyBalance',
      getAccountResources: 'account/getAccountResources'
    }),
    getMainCurrencyStaked() {
      let mainCurrencyStaked = 0
      let res = this.getAccount.self_delegated_bandwidth
      if (res) {
        mainCurrencyStaked = (parseFloat(res.net_weight) + parseFloat(res.cpu_weight))
      }
      return mainCurrencyStaked
    }
  },
  mounted() {
    if (this.getAccountName) {
      this.lookupTokenBalance()
      this.getTokenPrices()
    }
  },
  methods: {
    async getPriceOf(name) {
      try {
        let price = await this.$axios.get('https://api.coingecko.com/api/v3/coins/' + name.toLowerCase() + '?localization=false')
        return price.data.market_data.current_price.usd
      } catch (error) {
        throw Error('bad')
      }
    },
    async getTokenPrices() {
      try {
        let mainP = await this.getPriceOf(this.mainCurrencyName)
        let tokenP = await this.getPriceOf(this.tokenName)
        this.total = ((mainP * (this.getMainCurrencyBalance + this.getMainCurrencyStaked)) + (tokenP * this.getTokenBalance)).toFixed(3)
        this.showValue = true
      } catch (error) {
        this.showValue = false
      }
    },
    transfer() {
      if (this.tokenSelection === this.tokenName) {
        this.$refs.Transaction.newTransaction(this.$configFile.network.tokenContract.name, 'transfer', {
          from: this.getAccountName,
          to: this.transferTo,
          quantity: this.transferAmount.toFixed(this.$configFile.network.tokenContract.decimals) + ' ' + this.$configFile.network.tokenContract.token,
          memo: this.transferMemo
        })
      } else {
        this.$refs.Transaction.newTransaction(this.$configFile.network.mainCurrencyContract.name, 'transfer', {
          from: this.getAccountName,
          to: this.transferTo,
          quantity: this.transferAmount.toFixed(this.$configFile.network.mainCurrencyContract.decimals) + ' ' + this.$configFile.network.mainCurrencyContract.token,
          memo: this.transferMemo
        })
      }
    },
    async lookupTokenBalance() {
      try {
        this.loading = true
        this.loadingText = 'Looking up balances...'
        const balance = this.$store.dispatch('api/getTokenContractBalance')
        const mainBalance = this.$store.dispatch('api/getMainCurrencyBalance')
        const acc = this.$store.dispatch('api/updateAccountInfo')
        let race = await Promise.race([balance, mainBalance, acc])
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
      if (this.tokenSelection === this.tokenName) {
        if (val > this.getTokenBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
          this.transferAmountError = true
          this.transferAmountErrorText = 'Invalid amount'
        } else {
          this.transferAmountError = false
        }
      } else if (this.tokenSelection === this.mainCurrencyName) {
        if (val > this.getMainCurrencyBalance || ((val + "").match(/\./g) || []).length > 1 || val < 0 || !val) {
          this.transferAmountError = true
          this.transferAmountErrorText = 'Invalid amount'
        } else {
          this.transferAmountError = false
        }
      } else {
        this.transferAmountError = false
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
<style lang="stylus">
@import '~variables'

.gradient-bg-primary
  background-image linear-gradient(to right, $primary, $p-light)

.blur-details
  background rgba(255, 255, 255, 0.1)
</style>
