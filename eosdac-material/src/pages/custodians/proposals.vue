<template>
<q-page class="text-white q-ma-lg">
  <div>proposals by current active custodians</div>
  <div v-for="(proposal, index) in proposals" :key="index" >
    <pre>{{getactiveCustodians[index].cust_name}} - {{proposal}}</pre>
  </div>
  <Transaction ref="Transaction"  />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Proposals',
  components: {
      Transaction
  },
  data() {
    return {
      proposals: []

    }
  },
  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    getProposalsFromAllCustodians(){
      console.log(this.getactiveCustodians);
      let proms = [];
      this.getactiveCustodians.forEach( c => {
        let p =  this.$store.dispatch('api/getProposalsFromAccount', c.cust_name);
        proms.push(p);
      });
      Promise.all(proms).then(values => {
        this.proposals = values;
      });
      
    },
    approveProposal(proposer, proposal_name, permission="active"){
        this.$refs.Transaction.newTransaction([{
        contract: 'eosio.msig',
        action: 'approve',
        fields: {
          proposer: proposer,
          proposal_name: proposal_name,
          level: { "actor": this.getAccountName, "permission": permission },
         
        }
      }]);
    }
  },
  mounted(){
    this.getProposalsFromAllCustodians();
  }

}
</script>

<style>
</style>
