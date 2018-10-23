<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Manage Msig Proposals</h4>


  <div v-for="(msig, index) in msigproposals" class="q-mb-md bg-dark2 round-borders shadow-5" :key="index">
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            {{msig.type}}
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <span>{{msig.title}}</span>
          </div>
        </q-item-main>
      </template>
      <div class="q-px-md q-pb-md" >
        <div  class="q-pt-md" style="border-top:1px solid grey;">
          <div class="q-pb-md">{{msig.description}}</div>
          <div v-for="(key, i) in Object.keys(msig.data)" :key="i">
            <span class="text-dimwhite">{{key}}:</span><span> {{msig.data[key]}}</span>
          </div>
          <div style="height:35px">
            <q-btn class="float-right" color="primary" label="Approve" />
          </div>
        </div>
      </div>
    </q-collapsible>
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
  name: 'MsigProposals',
  components: {
      Transaction
  },
  data() {
    return {
      proposals: [],
      msigproposals:[
        {
          title: 'this is a title of a multisig proposal',
          type: 'transfer',
          description: 'this is a description about this msig transaction',
          data: {from: 'kas', to: 'evilmikehere', amount: '20 KASDAC', memo: ''}
        },
        {
          title: 'this is an other title',
          type: 'transfer',
          description: 'this is yet an other one',
          data: {from: 'kas', to: 'evilmikehere', amount: '20 KASDAC', memo: ''}
        }
      ]

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

  }

}
</script>

<style>
.msigproposal_header{
  height:80px
}
</style>
