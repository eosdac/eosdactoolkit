<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Review Msig Transactions</h4>


<q-tabs class="q-mb-md" @select="manageTabChange">
  <!-- Tabs - notice slot="title" -->
  <q-tab default slot="title" name="open" label="open" />
  <q-tab slot="title" name="executed" label="executed"  />
  <q-tab slot="title" name="cancelled" label="cancelled"  />

</q-tabs>

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
  created(){
    this.$root.$on("reloadproposals", this.getProposalsWithDelay);
  },

  methods:{
    manageTabChange(tab){
      switch(tab) {
        case 'open':
          console.log('get open');
          break;
        case 'executed':
          console.log('show executed');
          break;
        case 'cancelled':
          console.log('get cancelled');
          break;
        default:
          // code block
      } 
    },
    async getProposals(){
      let p =  await this.$store.dispatch('api/getMsigProposals');
      this.proposals = p;
      console.log(p)
      
    },
    getProposalsWithDelay(){
      setTimeout(this.getProposals, 6000)
    }


  }

}
</script>

<style>
.msigproposal_header{
  height:80px
}
</style>
