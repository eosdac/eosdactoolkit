<template>
  <div class="row  bg-dark2 round-borders" style="">
    <div class="col-md-6 col-xs-12 q-pa-md">

	    <!-- <q-select
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
	    /> -->


      <q-input stack-label="Proposal name" dark  v-model="msigtemplate.proposal_name" />
      <q-input stack-label="Title" dark  v-model="meta.title" />
      <q-input dark v-model="meta.description" type="textarea" stack-label="Description" :max-height="100" rows="7" />

      <div class="q-my-md">Expiration</div>
      <q-datetime-picker minimal dark color="positive" v-model="msigtemplate.trx.expiration" :min="mindate" :max="maxdate" type="date" />
    </div>

    <!-- coll 2 -->
    <div class="col-md-6 col-xs-12 q-pa-md ">
      <div class="column full-height justify-between">
       
        <div>
          <q-tabs>
            <!-- Tabs -->
            <q-tab slot="title" default name="tab-4"  label="transfer" />
            <q-tab slot="title" name="rawmsigtr" label="raw" />
            <!-- Targets -->
            <q-tab-pane class="bg-dark" name="tab-4">
              <q-select
                class="q-mb-md"
                :disabled="false"
                dark
                stack-label ="From (dac account)"
                placeholder="Select account"
                v-model="msigtemplate.trx.actions[0].data.from"
                :options="fromAccountOptions"
                @input="msigtemplate.trx.actions[0].authorization[0].actor=msigtemplate.trx.actions[0].data.from"
              />
              <q-input dark stack-label="To" v-model="msigtemplate.trx.actions[0].data.to"/>
              <q-input type="number" dark stack-label="Quantity" v-model="raw_quantity"/>
              <q-select
                class="q-mb-md"
                :disabled="false"
                dark
                stack-label ="Asset"
                placeholder="Select token symbol"
                v-model="token"
                :options="[{label: 'KASDAC', value: 'kasdactokens-KASDAC'}, {label: 'EOS', value: 'eosio.token-EOS'}]"
              />
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
          <!-- <q-btn class="float-right" label="test" color="primary" @click="transactionCallback" /> -->
        </div>
      </div>
    </div>
    <Transaction ref="Transaction" v-on:done="transactionCallback" />
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

  watch:{
    raw_quantity(v){
      if(!v) v=0;
      this.msigtemplate.trx.actions[0].data.quantity = v.toFixed(4)+' '+this.token.split('-')[1];
      
    },
    token(v){
      if(!this.raw_quantity) this.raw_quantity = 0;
      this.msigtemplate.trx.actions[0].data.quantity = this.raw_quantity.toFixed(4)+' '+v.split('-')[1];
      this.msigtemplate.trx.actions[0].account = v.split('-')[0]
    }
  },
  data () {
    return {
      raw_quantity:'',
      token: '',

      fromAccountOptions: [],

      //init values for datepicker
      mindate: today,
      maxdate: addToDate(today, {days: 14}),

      //msig
      meta: {
        title: "",
        description: ""
      },
      msigtemplate: {
        proposer: '',
        proposal_name: '',
        requested: [],
        trx: { 
            expiration: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), 
            ref_block_num: 0, 
            ref_block_prefix: 0, 
            max_net_usage_words: 0, 
            max_cpu_usage_ms: 0, 
            delay_sec: 0, 
            context_free_actions: [], 
            actions: [ 
                { 
                account: '', 
                name: 'transfer', 
                authorization: [ { actor: '', permission: 'xfer' } ], 
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

      this.msigtemplate.proposer = this.getAccountName;
      this.msigtemplate.requested = this.getActiveCustodians.map(c => {
        let req = {actor: c.cust_name, permission: 'active'};
        return req;
      });
      this.setFromAccountOptions();
      

    },

    async setFromAccountOptions(){
      //get controlled accounts from authority account
      let ctrlaccs = await this.$store.dispatch('api/getControlledAccounts', {accountname: this.$configFile.network.authorityAccount});

      //get the permissions from each account synchronous
      let proms = [];
      ctrlaccs.controlled_accounts.forEach(ctrlacc =>{
        proms.push( this.$store.dispatch('api/getAccountPermissions', {accountname: ctrlacc }) );
      });
      let res = await Promise.all(proms);
      

      //map accountnames with fetched permissions
      res = res.map((r, i)=>{
        let t = {};
        t.account = ctrlaccs.controlled_accounts[i];
        t.permissions = r;
        return t;
      })
      console.log(res);

      //filter: only keep accounts where xfer is set
      res = res.filter(acc => {
        if(acc.permissions.find(p => p.perm_name == 'xfer') ) return true;
      });

      //set from account options
      this.fromAccountOptions = res.map(o => {
        return {value: o.account, label: o.account};
      });
    },

    //send proposal to msig system contract. this should be changed to the eosdac msig relay contract
    proposeMsig(){
      if(!this.verifyMsig() ){
        return false;
      }

      let actions = [
        {
          contract: 'eosiomsigold', 
          action: 'propose', 
          fields: this.msigtemplate,
          
        },
        {
          contract: 'dacmultisigs', 
          action: 'proposed',
          authorization: [ {actor: this.getAccountName, permission: 'active'}, {actor: 'dacauthority', permission: 'one'}],
          fields: {proposer: this.getAccountName, proposal_name: this.msigtemplate.proposal_name, metadata: JSON.stringify(this.meta)}
        }

      ];
      let abicache = false;
      if(this.msigtemplate.trx.actions[0].account != 'eosio.token'){
        abicache = this.msigtemplate.trx.actions[0].account;
      }
      console.log(abicache)
      this.$refs.Transaction.newTransaction(actions, false, abicache);
    },

    verifyMsig(){
      this.msigtemplate.trx.expiration = this.msigtemplate.trx.expiration.split('.')[0];

      if(this.msigtemplate.trx.actions[0].data.from ==''){
        alert('please input from data');
        return false;

      }

      return true;
      
    },

    transactionCallback(){
      this.$root.$emit("reloadproposals");
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
