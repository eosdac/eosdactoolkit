<template>
  <div class="q-pa-md q-mb-xl bg-dark2 round-borders shadow-5" style="min-height:500px">
    <div>
      <q-input dark stack-label="Proposal name" v-model="msigtemplate.proposal_name" />
      <div class="q-my-md">expiration</div>
      <q-datetime-picker minimal dark v-model="msigtemplate.trx.expiration" type="date" />
    </div>
    <pre>{{msigtemplate}}</pre>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Msigcreator',
  components: {

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
                account: '', 
                name: 'transfer', 
                authorization: [ { actor: 'kas', permission: 'active' } ], 
                data: {} 
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
