<template>
  <div class="row  bg-dark2 round-borders shadow-5" style="">
    <div class="col-md-6 col-xs-12 q-pa-md">
      <q-input dark stack-label="Proposal name" v-model="msigtemplate.proposal_name" />
      <div class="q-my-md">Expiration</div>
      <q-datetime-picker minimal dark  v-model="msigtemplate.trx.expiration" type="date" />
    </div>
    <div class="col-md-6 col-xs-12 q-pa-md ">
      <div class="column full-height justify-between">
        <div>
          Add action
        </div>
        <div style="height:30px">
          <q-btn class="float-right" label="propose" color="primary" @click="proposeMsig" />
        </div>
      </div>
    </div>
    <!-- <pre>{{msigtemplate}}</pre> -->
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
                account: 'kasdactokens', 
                name: 'transfer', 
                authorization: [ { actor: 'kas', permission: 'active' } ], 
                data: {from:'kas', to:'kasperkasper', quantity: '1.0000 KASDAC', memo:'testmsig'} 
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
