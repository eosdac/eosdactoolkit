<template>
<q-page class="text-white q-ma-lg">
  <div>proposals</div>
  <Transaction ref="Transaction" v-on:done="" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Proposals',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    async getProposalsFromAllCustodians(){
      console.log(this.getactiveCustodians);
      this.getactiveCustodians.forEach(async c => {
        let p = await this.$store.dispatch('api/getProposalsFromAccount', c.cust_name);
        console.log(p)
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
      }])
    }
  },
  mounted(){
    this.getProposalsFromAllCustodians();
  }

}
</script>

<style>
</style>
