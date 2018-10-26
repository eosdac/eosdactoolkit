<template>
  <div class="row  bg-dark2 round-borders shadow-5" style="">
    <div class="col-md-6 col-xs-12 q-pa-md">
      <div class="q-my-md">Proposal name</div>
      <q-input dark  v-model="msigtemplate.proposal_name" />
      <div class="q-my-md">Expiration</div>
      <q-datetime-picker minimal dark color="positive" v-model="msigtemplate.trx.expiration" type="date" />
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
              <pre>{{msigtemplate}}</pre>
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
                authorization: [ { actor: '', permission: 'active' } ], 
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
    init(){
      this.msigtemplate.proposer = this.getAccountName;
      this.msigtemplate.requested = this.getActiveCustodians.map(c => {
        let req = {actor: c.cust_name, permission: 'active'};
        return req;
      });
      this.msigtemplate.trx.actions[0].authorization[0].actor = this.getAccountName;

    },
    proposeMsig(){
      this.msigtemplate.trx.expiration = this.msigtemplate.trx.expiration.split('.')[0];
      let actions = [{
        contract: 'eosio.msig', 
        action: 'propose', 
        fields: this.msigtemplate
      }];
      this.$refs.Transaction.newTransaction(actions, false);
    },

  

  },


  mounted:function(){
    this.init();
  }

}
</script>

<style lang ="stylus">
@import '~variables'


</style>
