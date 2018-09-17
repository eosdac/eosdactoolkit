<template>
<q-page class="text-white q-pa-md">
<h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("regcandidate.register_as_candidate") }}</h4>


<div v-if="!profile_is_irrevirsible" class="bg-dark2 q-pa-md round-corners shadow-5">
  For registering as a candidate you need a profile.
  <span v-if="hasprofile">You submitted your profile but it is still unconfirmed on the blockchain.</span>
</div>

<div v-if="profile_is_irrevirsible" class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">
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
        <q-btn size="md" class="animate-pop" :loading="loading" color="primary" @click="unregisterAsCandidtate" :label="$t('regcandidate.unregister')">
          <q-spinner slot="loading" />
        </q-btn>
        <pre>{{getMemberRoles}}</pre>
      </div>
</div>

<Transaction ref="Transaction" v-on:done="checkMemberRoles()" />
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
      hasprofile : false,
      profile_is_irrevirsible: false,
      stakedata: { quantity: '2.0000 KASDAC', memo: 'dacelections'},
      registerdata: { bio:'', requestedpay :'100.0000 EOS'}

    }
  },
  created() {
    this.getProfileData();
    this.getContractConfig();
    this.checkMemberRoles();
  },

  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getMemberRoles: 'account/getMemberRoles'
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
          this.checkMemberRoles();

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

    unregisterAsCandidtate(){
        this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name,'unregcand', {
        cand: this.getAccountName
      }, false)
    },

    async getContractConfig() {
      this.init_loading = true;
      let config = await this.$store.dispatch('api/getContractConfig', {contract: this.$configFile.network.custodianContract.name})
      if(config){
        this.stakedata.quantity = config.lockupasset;
      }
      this.init_loading = false;
    },

    async checkMemberRoles(){
      try {
        let iscandidate = await this.$store.dispatch('api/getIsCandidate');
        console.log(iscandidate)
      } catch (err) {
        throw err
      }
    },

    async getProfileData(){
      let p = await this.$store.dispatch('api/getProfileData', {accountname: this.getAccountName} );
      if(p && p.length){
        this.hasprofile = true;
        this.profile_is_irrevirsible = p[0].irrevirsible;
      }
      else{
        this.profile_is_irrevirsible = false;
      }
 
      

    },



  }
}
</script>
