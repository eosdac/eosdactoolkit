<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Review Msig Transactions</h4>

  <Msigproposal
        v-for="(msig, index) in proposals"
        :key="index"
        :msig="msig"
  />
  

  <h4 class="q-display-1 q-mt-none q-mb-md">Create Msig Transaction</h4>
  <div class="q-mb-lg"><MsigCreator /></div>




  <Transaction ref="Transaction"  />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import MsigCreator from 'components/msigcreator'
import Msigproposal from 'components/msig-proposal'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'MsigProposals',
  components: {
      Transaction,
      MsigCreator,
      Msigproposal
  },

  data() {
    return {
      systemmsig: 'eosiomsigold',
      proposals: []
    }
  },

  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
    })

  },

  mounted() {
    this.getProposals();

  },
  
  methods:{
    async getProposals(){
      let p =  await this.$store.dispatch('api/getMsigProposals');
      this.proposals = p;
      console.log(p)
      
    },

  
    //approve a proposal via msig relay {"proposer":0,"proposal_name":0,"level":0}
    approveProposal(proposer, proposal_name, permission="active"){
      console.log('ssssss')
        let actions = [
        {
          contract: this.systemmsig, 
          action: 'approve', 
          fields: {
            proposer: proposer,
            proposal_name: proposal_name,
            level: { "actor": this.getAccountName, "permission": permission }
          }
          
        },
        {
          contract: 'dacmultisigs', 
          action: 'approved',
          authorization: [ {actor: this.getAccountName, permission: 'active'} ],
          fields: {
            proposer: proposer, 
            proposal_name: proposal_name, 
            approver: this.getAccountName }
        }

      ];
        this.$refs.Transaction.newTransaction(actions);
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
  }

}
</script>

<style>
.msigproposal_header{
  height:80px
}
</style>
