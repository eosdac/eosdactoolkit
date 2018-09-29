<template>
<q-page class="text-white ">

  <div class=" gradient-bg-primary q-px-md q-pt-md relative-position" style="min-height:260px; overflow:hidden">
    <div class="row">
      <div class="col-12">
        <h4 v-if="!getMemberRoles.candidate" class="q-display-1 q-mb-sm q-mt-none">{{ $t("regcandidate.register_as_candidate") }}</h4>
        <h4 v-if="getMemberRoles.candidate" class="q-display-1 q-mb-sm q-mt-none">{{ $t("regcandidate.unregister_as_candidate") }}</h4>
      </div>
    </div>

    <div class="blur-details q-pa-md absolute-bottom" style="height:120px;margin-right:-16px;margin-left:-16px;">
      <div class="column  justify-center q-px-md full-height">
      </div>
    </div>
  </div>

<div class="q-pa-md">
  <div v-if="!profile_is_irrevirsible" class="bg-dark2 q-pa-md round-corners shadow-5">
    {{ $t("regcandidate.profile_required") }}
    <span v-if="hasprofile">{{ $t("regcandidate.profile_not_confirmed") }}</span>
  </div>

  <div v-if="profile_is_irrevirsible" class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">

        <div class="col-md-8 col-sm-12 q-pa-md text-dimwhite">
          <div v-if="!getMemberRoles.candidate" >{{$t('regcandidate.page_description_unregistered') }}</div>
          <div v-if="getMemberRoles.candidate" >
            <span>{{$t('regcandidate.page_description_registered') }}</span>
            <ul>
              <li>{{ $t('regcandidate.stake_amount') }}: {{ iscandidatedata.locked_tokens }}</li>
              <li>{{ $t('regcandidate.requested_pay') }}: {{ iscandidatedata.requestedpay }}</li>
            </ul>
            
          </div>

          <div v-if="getMemberRoles.custodian">{{ $t('regcandidate.page_description_active_custodian') }}</div>
          <pre>{{iscandidatedata}}</pre>
          <pre>{{stakeRequirementMet}}</pre>
        </div>

        <div class="col-md-4 col-sm-12 q-pa-md">
          <span v-if="!getMemberRoles.candidate">
          <q-input v-if="!stakeRequirementMet" color="p-light" dark type="text" v-model="stakedata.quantity" :float-label="$t('regcandidate.stake_amount')" :placeholder="$t('regcandidate.amount_to_stake_placeholder')" />
          <!-- <q-input dark  type="hidden" v-model="registerdata.bio"  float-label="Profile JSON url" placeholder="http://example.com/myjsonprofile.json" /> -->
          <q-input class="q-my-md" color="p-light" dark type="text" v-model="registerdata.requestedpay" :float-label="$t('regcandidate.requested_pay')" :placeholder="$t('regcandidate.requested_custodian_pay_placeholder')" />
          <q-btn size="md"  class="animate-pop" :loading="loading" color="primary" @click="registerAsCandidate" :label="$t('regcandidate.register')">
            <q-spinner slot="loading" />
          </q-btn>
          </span>
          <q-btn size="md" v-if="getMemberRoles.candidate" class="animate-pop" :loading="loading" color="primary" @click="unregisterAsCandidtate" :label="$t('regcandidate.unregister')">
            <q-spinner slot="loading" />
          </q-btn>
          <!-- <pre>{{getMemberRoles}}</pre> -->
        </div>
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
      iscandidatedata : false,
      stakedata: { quantity: '2.0000 KASDAC', memo: 'dacelections'},
      registerdata: { requestedpay :'100.0000 EOS'}

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
    }),

    stakeRequirementMet(){
      if(this.iscandidatedata){
        let stake = this.iscandidatedata.locked_tokens.split(" ")[0];
        let required_stake = this.stakedata.quantity.split(" ")[0];
        if(stake >= required_stake){
          return true;
        }
        else{
          return false;
        }
      }

    }
  },
  methods:{
    registerAsCandidate() {
        this.loading = true;
        this.$store.dispatch('api/registerCandidate', {
          scatter: true,
          stakedata: this.stakedata,
          registerdata : this.registerdata,
          staked_enough: this.stakeRequirementMet
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
        this.$refs.Transaction.newTransaction(this.$configFile.network.custodianContract.name,'withdrawcand', {
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
        this.iscandidatedata = await this.$store.dispatch('api/getIsCandidate');
        // console.log(iscandidate);
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
