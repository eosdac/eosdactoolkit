<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Create Msig Transaction</h4>
  <!-- <MsigCreator /> -->
  <h4 class="q-display-1 q-mt-none q-mb-md">Review Msig Transactions</h4>


  <div v-for="(msig, index) in msigproposals" class="q-mb-md bg-dark2 round-borders shadow-5" :key="index">
    <q-collapsible  label="First" group="msigproposals" icon-toggle header-class="msigproposal_header" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-icon size="24px" name="icon-transfers" class="q-mr-xs" /><span> {{msig.type}}</span>
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <div class="q-title q-mb-xs">{{msig.title}}</div>
            <div class="q-caption">
              <span class="text-dimwhite">Submitted by: </span>
              <router-link :to="{path: '/profile/' + msig.proposer}" >
                {{ msig.proposer }}
              </router-link>
            </div>
          </div>
        </q-item-main>
        <q-item-side right >
          <div class="q-caption text-dimwhite" >Received Approvals:</div>
          <div class="text-white q-display-1"><span class="text-p-light">5</span> / 12</div>
        </q-item-side>
      </template>
      <div class="q-px-md q-pb-md" >
        <div style="border-top:1px solid grey;">
          <div class="row gutter-md q-pt-md">
            <div class="col-md-4 col-xs-12" >
              <div style="background:none">
                <div v-for="(key, i) in Object.keys(msig.data)" :key="i" style="border-bottom: 1px solid grey">
                  <span class="text-dimwhite ">{{key}}:</span><span class=""> {{msig.data[key]}}</span>
                </div>
              </div>
            </div>
            <div class="col-md-8 col-xs-12" >
              <div style="background:none">
                <span class="text-dimwhite">{{msig.description}}</span>
                <div style="height:35px">
                  <q-btn class="float-right" color="positive" label="Approve" />
                </div>
              </div>
            </div>
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
import MsigCreator from 'components/msigcreator'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'MsigProposals',
  components: {
      Transaction,
      MsigCreator
  },
  data() {
    return {
      proposals: [],
      msigproposals:[
        {
          title: 'This is a title of a multisig proposal',
          proposer: 'kas',
          type: 'Transfer',
          description: 'This is a description about this msig transaction. Everyone knows that descriptions are most of the time super boring. But this one isn\'t because it\'s a little longer. Decide for yourself if this is true or not. Thank you :-)',
          data: {from: 'kas', to: 'evilmikehere', amount: '20 KASDAC', memo: ''}
        },
        {
          title: 'This is an other title',
          proposer: 'evilmikehere',
          type: 'Transfer',
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
