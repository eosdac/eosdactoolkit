<template>
<q-page class="text-white q-pa-md">
 vote producers
    <q-btn class="q-mb-md" label="vote" color="primary" @click="castVotes" />
   <div v-for="(prod, index) in producers" class="q-mb-md bg-dark2 round-borders shadow-5" :key="index">
    <q-collapsible  label="First" group="producers" icon-toggle header-class="" collapse-icon="icon-ui-11">
      <template slot="header" >
        <q-item-side left >
          <div class="row full-height items-center">
            <q-btn v-if="!prod.selected" class="q-mr-md float-left" icon="icon-plus" round color="primary" style="height:55px;width:55px;margin-top:0px;" @click="addVote(prod.owner)" />
            <q-btn v-else class="q-mr-md" icon="icon-ui-6" round color="positive" style="height:55px;width:55px;margin-top:0px;" @click="removeVote(prod.owner)"/>
          </div>
        </q-item-side>
        <q-item-main >
          <div class="q-ml-lg">
            <div class="q-title q-mb-xs">{{prod.owner}}</div>
            <div class="q-caption">
              <span>Votes: </span>
              <span class="text-dimwhite">{{parseInt(prod.total_votes)}}</span>
            </div>
          </div>
        </q-item-main>
        <q-item-side right >
          <div class="q-caption text-dimwhite" >Relative vote weight:</div>
          <div class="text-white q-display-1"><span >{{prod.percentage.toFixed(2)}}</span><span class="text-dimwhite">%</span></div>
        </q-item-side>
      </template>
      <div class="q-px-md q-pb-md" >
        <div style="border-top:1px solid grey;">
          <div class="row gutter-md q-pt-md">
            <div class="col-md-4 col-xs-12" >
              <div style="background:none">
                <pre>{{prod}}</pre>
              </div>
            </div>
            <div class="col-md-8 col-xs-12" >
              <div class="column justify-between full-height" style="background:none">
ccccccccccccccc
              </div>
            </div>
          </div>
        </div>

      </div>
    </q-collapsible>
  </div>

  <Transaction ref="Transaction"  />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'voteproducers',
  components: {
      Transaction,
      LoadingSpinner

  },
  data() {
    return {
      loading: false,
      loadingText: '',
      producers: [],
      total_votes: 0

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    async getProducers(){
      try{
      var p =  await this.$store.dispatch('api/getProducers');
      var myvotes = await this.$store.dispatch('api/getProducerVotes', {member: this.getAccountName});
      }catch(e){
        console.log(e)
      }

      p.sort(function(a, b) {
          return parseFloat(b.total_votes) - parseFloat(a.total_votes);
      });
      
 
      this.total_votes = p.reduce((total, obj) => parseInt(obj.total_votes) + total, 0);
      p = p.map(pr => {
        pr.percentage = pr.total_votes/this.total_votes*100;
        pr.selected = myvotes[0].producers.indexOf(pr.owner) >= 0 ? true : false;
        return pr; 
      })
      this.producers = p;
    },

    addVote(prod){
      if(this.getNewVotes().length < 30){
        this.producers.find( p => p.owner === prod).selected = true;
      }
      else{
        alert(this.getNewVotes().length)
      }
      
    },

    removeVote(prod){
      this.producers.find(p => p.owner === prod).selected = false;
    },
    getNewVotes(){
      return this.producers.filter(p => p.selected == true ).map(s => s.owner);
    },
    castVotes(){
        let votes = this.getNewVotes();
        console.log(votes)
        this.$refs.Transaction.newTransaction([{
        contract: 'eosio',
        action: 'voteproducer',
        fields: {"voter": this.getAccountName,"proxy":"","producers": votes.sort()}
      }]);
    },

    _calculateVoteWeight(stakeamount){
        const epoch = 946684800000; 
        const seconds_per_day = 86400;
        let now = new Date().getTime()/1000; //in seconds
        let weight = parseInt( (now - (epoch / 1000)) / (seconds_per_day * 7) )/52 ;
        return (stakeamount*Math.pow(2, weight)).toFixed(17);
    }

  },
  mounted(){
    this.getProducers();
  }

}
</script>

<style>

</style>
