<template>
  <div class="row  bg-dark2 round-borders shadow-5" style="">
    <div class="col-md-6 col-xs-12 q-pa-md">

	    <q-select
        class="q-mb-md"
        dark
	      stack-label ="Controlled accounts"
	      placeholder="Select an account"
	      v-model="msigtemplate.trx.actions[0].authorization[0].actor"
	      :options="controlledAccountOptions"
	      @input="getPermissions"
	    />

	    <q-select
        class="q-mb-md"
        :disabled="msigtemplate.trx.actions[0].authorization[0].actor==''"
        dark
	      stack-label ="Permission"
	      placeholder="Select permission"
	      v-model="selected_permission"
	      :options="permissionsOptions"
	      @input="msigtemplate.trx.actions[0].authorization[0].permission = selected_permission; setRequested()"
	    />



      <div class="q-my-md">Proposal name</div>
      <q-input dark  v-model="msigtemplate.proposal_name" />
      <div class="q-my-md">Expiration</div>
      <q-datetime-picker minimal dark color="positive" v-model="msigtemplate.trx.expiration" :min="mindate" :max="maxdate" type="date" />
    </div>
    <div class="col-md-6 col-xs-12 q-pa-md ">
      <div class="column full-height justify-between">
        <div>
          <q-tabs>
            <!-- Tabs - notice slot="title" -->

            <q-tab slot="title" default name="tab-4"  label="transfer eos" />
            <q-tab slot="title" name="rawmsigtr" label="raw" />

            <!-- Targets -->
            <q-tab-pane class="bg-dark" name="tab-4">
              <q-input dark stack-label="From" v-model="msigtemplate.trx.actions[0].data.from"/>
              <q-input dark stack-label="To" v-model="msigtemplate.trx.actions[0].data.to"/>
              <q-input dark stack-label="Quantity" v-model="msigtemplate.trx.actions[0].data.quantity"/>
              <q-input dark stack-label="Memo" v-model="msigtemplate.trx.actions[0].data.memo"/>
            </q-tab-pane>
            <q-tab-pane class="bg-dark" name="rawmsigtr">
              <q-scroll-area
                style="width: 100%; height: 300px;"
                :thumb-style="{
                  right: '-13px',
                  borderRadius: '2px',
                  background: '#7c41ba',
                  width: '10px',
                  opacity: 0.8
                }"
              >
                <pre>{{msigtemplate}}</pre>
              </q-scroll-area>
            </q-tab-pane>
          </q-tabs>
        </div>
        <div class="q-mt-md" style="height:30px">
          <q-btn class="float-right" label="propose" color="primary" @click="proposeMsig" />
        </div>
      </div>
    </div>
    <Transaction ref="Transaction"  />
  </div>
</template>

<script>
import Transaction from './transaction'
import { date } from 'quasar'

const today = new Date()
const { addToDate, subtractFromDate } = date

import {
  Quasar
} from 'quasar'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Msigcreator',
  components: {
    Transaction
  },


  data () {
    return {
      //select msig controlled account
      //v-model = msigtemplate.trx.actions[0].authorization[0].actor
      controlledAccountOptions: [],

      //select permission level from selected controlled account
      //v-model = msigtemplate.trx.actions[0].authorization[0].permission
      permissionsOptions: [],
      selected_permission: '',

      //raw data account permissions
      accperms: [],

      //init values for datepicker
      mindate: today,
      maxdate: addToDate(today, {days: 14}),

      //msig
      msigtemplate: {
        proposer: '',
        proposal_name: '',
        requested: [],
        trx: { 
            expiration: '', 
            ref_block_num: 0, 
            ref_block_prefix: 0, 
            max_net_usage_words: 0, 
            max_cpu_usage_ms: 0, 
            delay_sec: 0, 
            context_free_actions: [], 
            actions: [ 
                { 
                account: 'eosio.token', 
                name: 'transfer', 
                authorization: [ { actor: '', permission: '' } ], 
                data: {from:'', to:'', quantity: '', memo:''} 
                }
            ], 
            transaction_extensions: [] 
        } 
      },
    }
  },

  computed: {
    ...mapGetters({

      getAccountName: 'account/getAccountName',
      getMemberRoles: 'account/getMemberRoles',
      getActiveCustodians: 'api/getActiveCustodians'
    })
  },

  methods: {
    async init(){
      if(this.getActiveCustodians == null){
        await this.$store.dispatch('api/getCustodians');
      };

      let ctrlacc = await this.$store.dispatch('api/getControlledAccounts');
      // console.log(ctrlacc)
      this.controlledAccountOptions = ctrlacc.controlled_accounts.map(function(a){ return {label: a, value: a} });

      this.msigtemplate.proposer = this.getAccountName;
      this.msigtemplate.requested = this.getActiveCustodians.map(c => {
        let req = {actor: c.cust_name, permission: 'active'};
        return req;
      });


    },

    async getPermissions(){
      let ctrlacc = this.msigtemplate.trx.actions[0].authorization[0].actor;
      //get permissions from selected msig account
      this.accperms = await this.$store.dispatch('api/getAccountPermissions', {accountname: ctrlacc });
      console.log(this.accperms);

      //filter the permissions that requires the signature from the logged in account
      this.accperms = this.accperms.filter(ap => {
        if(ap.required_auth.accounts.find(ac => ac.permission.actor == this.getAccountName) ) return true;
      })

      //map result ready for select box options
      this.permissionsOptions = this.accperms.map(function(a){ return {label: a.perm_name, value: a.perm_name } });
    },

    setRequested(){
      this.msigtemplate.requested=[];
      let p = this.accperms.find(ap => ap.perm_name == this.selected_permission );
      this.msigtemplate.requested = p.required_auth.accounts.map(a => a.permission );

      //set transaction delay
      if(p.required_auth.waits.length){
        this.msigtemplate.trx.delay_sec = p.required_auth.waits[0].wait_sec;
      }
      
    },


    //send proposal to msig system contract. this should be changed to the eosdac msig relay contract
    proposeMsig(){
      if(!this.verifyMsig() ){
        return false;
      }

      let actions = [{
        contract: 'eosio.msig', 
        action: 'propose', 
        fields: this.msigtemplate
      }];
      this.$refs.Transaction.newTransaction(actions, false);
    },

    verifyMsig(){
      this.msigtemplate.trx.expiration = this.msigtemplate.trx.expiration.split('.')[0];

      if(this.msigtemplate.trx.actions[0].data.from ==''){
        alert('please input from data');
        return false;

      }

      return true;
      
    },

    //approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    approveProposal(){

    },
    //unapprove a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    unapproveProposal(){

    },

    //execute a proposal via msig relay {"proposer":0,"proposal_name":0,"executer":0}
    executeProposal(){

    },
    
    //cancel a proposal via msig relay {"proposer":0,"proposal_name":0,"canceler":0}
    cancelProposal(){

    }


  

  },


  mounted:function(){

    this.init();
  }

}
</script>

<style lang ="stylus">
@import '~variables'


</style>
