<template>
<q-page class="text-white q-pa-md">
<h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("regcandidate.run_for_custodian") }}</h4>

<div class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">
      <div class="col-md-8 col-sm-12 q-pa-md">
        dddddddd
      </div>
      <div class="col-md-4 col-sm-12 q-pa-md">
        <q-input dark type="text" v-model="stakedata.quantity" float-label="Stake Amount" placeholder="1.0000 KASDAC" />
        <q-input dark type="url" v-model="registerdata.bio"  float-label="Profile JSON url" placeholder="http://example.com/myjsonprofile.json" />
        <q-input dark type="text" v-model="registerdata.requestedpay" float-label="Requested Pay" placeholder="requested pay in EOS" />
        <q-btn size="md" class="animate-pop" :loading="loading" color="primary" @click="registerAsCandidate" :label="$t('regcandidate.register')">
          <q-spinner slot="loading" />
        </q-btn>
      </div>
</div>

<Transaction ref="Transaction"  />
<LoadingSpinner :visible="init_loading" :text="$t('regcandidate.loadconfig')" />
</q-page>
</template>

<style lang="stylus">

</style>

<script>

import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'RegisterCandidate',
  components: {
    Transaction,
    LoadingSpinner
  },
  data (){
    return{
      loading: false,
      init_loading: false,
      stakedata: { quantity: '2.0000 KASDAC', memo: 'dacelections'},
      registerdata: { bio:'', requestedpay :'100.0000 EOS'}

    }
  },
  created() {
    this.getContractConfig();
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered'
    })
  },
  methods:{
    registerAsCandidate() {
        this.loading = true;
        this.$store.dispatch('api/registerCandidate', {
          scatter: true,
          stakedata: this.stakedata,
          registerdata : this.registerdata
        })
        .then(res => {
          this.$store.commit('api/NOTIFY', {
            icon: 'icon-ui-6',
            color: 'positive',
            message: 'transaction.transaction_successful',
            details: res.transaction_id,
            linkText: 'transaction.view_in_explorer',
            linkUrl: this.$configFile.api.tokenExplorerUrl + '/transaction/' + res.transaction_id
          })
          this.loading = false;

        }).catch(err => {

          if (err.type) {
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + err.type,
              detail: ''
            })
          } 
          else {
            this.$store.commit('api/NOTIFY', {
              icon: 'error',
              color: 'red',
              message: 'Error: ' + JSON.parse(err).error.details[0].message || JSON.parse(err),
              detail: ''
            })
          }
          this.loading = false;
        });
    },

    async getContractConfig() {
      this.init_loading = true;
      let config = await this.$store.dispatch('api/getContractConfig', {contract: this.$configFile.network.custodianContract.name})
      if(config){
        this.stakedata.quantity = config[0].lockupasset;
      }
      this.init_loading = false;
    },



  }
}
</script>
