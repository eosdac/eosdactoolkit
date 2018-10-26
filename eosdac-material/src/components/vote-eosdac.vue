<template>
<div v-if="getAccountName">
  <q-btn v-if="!hasVotedForUs || votedecay" color="dark" class="animate-pop" @click="openModal" >
    <q-icon name="icon-menu-3" class="on-left text-dimwhite"/> 
    <span>Vote For eosDAC</span>
  </q-btn>
  <div v-else><q-icon name="icon-ui-6" class="on-left text-dimwhite" style="margin-top:-5px"/><span>Thank you for your vote!</span></div>

  <q-modal minimized v-model="votemodal" >
    <div class="bg-dark">
      <!-- header -->
      <div style="height:50px" class="bg-dark2 row items-center justify-between q-px-md">
        <span>dddddd</span>
        <q-icon class=" cursor-pointer" name="icon-ui-8" @click.native="votemodal = false" />
      </div>
      <!-- content -->
      <div class="q-pa-md">
        <div v-if="myvotes[0]" >
          <div>{{modal_msg}} </div>
          <div class="relative-position row justify-between q-pa-md q-mt-md bg-dark2 round-borders mygrid">
            <div class="q-mb-md row inline full-width justify-between items-center text-dimwhite">
              <div class="col-xs-12 col-md-2">Votes <span>{{myvotes[0].producers.length}}/30</span></div>
              <div class="col-xs-12 col-md-4">
                <div class="q-caption q-my-xs">Voting Power <span>{{(100-votedecay_percent).toFixed(2)}}%</span></div>
                <q-progress :percentage="100-votedecay_percent" />
              </div>
            </div>
            <span v-for="(prod, i) in myvotes[0].producers" :key="i">
              <q-chip v-if="prod == eosdacBP" class="q-ma-xs" closable @hide="removeVote(i)" color="positive">{{prod}}</q-chip>
              <q-chip v-else class="q-ma-xs"  closable @hide="removeVote(i)" color="dark">{{prod}}</q-chip>
            </span>
          </div>
          <div class="row justify-end q-mt-md items-center" style="height:30px">
            <div  class="on-left animate-fade" v-if="btn_feedback">{{btn_feedback}}</div>
            <q-btn label="confirm" color="primary" @click="castVotes" @blur.native="btn_feedback=''" />
          </div>
        </div>
      </div>
      
      
    </div> 
  </q-modal>

  <Transaction ref="Transaction" v-on:done="votemodal=false; init()" />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</div>

</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'voteeosdac',
  components: {
      Transaction,
      LoadingSpinner

  },
  data() {
    return {
      loading: false,
      loadingText: '',
      myvotes:[],
      votemodal: false,
      modal_msg: '',
      hasVotedForUs: false,
      eosdacBP : '',
      votedecay: true,
      votedecay_percent: 0,
      btn_feedback:''

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    async init(){
      if(this.$configFile.network.tokenContract.name=="kasdactokens"){
        this.eosdacBP = 'eosdacserval';
      }
      else{
        this.eosdacBP = 'eosdacserver';
      }
      this.myvotes = await this.$store.dispatch('api/getProducerVotes', {member: this.getAccountName});
      console.log(this.myvotes)
      this.hasVotedForUs = this.myvotes[0].producers.indexOf(this.eosdacBP) >= 0 ? true : false;

      let vote_weight_now = this._calculateVoteWeight(this.myvotes[0].staked)*100000000000000000;
      let last_vote_weight = this.myvotes[0].last_vote_weight*100000000000000000;
      console.log(vote_weight_now, last_vote_weight)

      this.votedecay_percent = (Math.abs((last_vote_weight) - (vote_weight_now)) /(((last_vote_weight)+(vote_weight_now))/2))*100;

    },

    castVotes(){
        let votes = this.myvotes[0].producers;
        if(votes.length >30){
          this.btn_feedback = 'Please remove one of your votes.';
          return false;
        }
        this.$refs.Transaction.newTransaction([{
        contract: 'eosio',
        action: 'voteproducer',
        fields: {"voter": this.getAccountName,"proxy":"","producers": votes.sort()}
      }]);
    },
    openModal(){
      this.votemodal = true;
      if(!this.hasVotedForUs){
        this.myvotes[0].producers.push(this.eosdacBP);
        this.myvotes[0].producers.sort();
        this.modal_msg = `Our BP is added to your vote list. `;
        //move this to html
        if(this.myvotes[0].producers.length >30){
          this.modal_msg += `Please delete a vote to replace with ${this.eosdacBP}`;
        }
      }
      else{
        this.modal_msg = `Thank you for voting for "${this.eosdacBP}"`;
      }
    },
    removeVote(i){
      this.myvotes[0].producers.splice(i, 1)
    },
  
    _calculateVoteWeight(stakeamount){
        const epoch = 946684800000; 
        const seconds_per_day = 86400;
        let now = new Date().getTime()/1000; //in seconds
        let weight = parseInt( (now - (epoch / 1000)) / (seconds_per_day * 7) )/52 ;
        return (stakeamount*Math.pow(2, weight)).toFixed(17);
    },
    // async getProducers(){
    //   try{
    //   var p =  await this.$store.dispatch('api/getProducers');
    //   this.myvotes = await this.$store.dispatch('api/getProducerVotes', {member: this.getAccountName});
    //   console.log(this.myvotes)
    //   }catch(e){
    //     console.log(e)
    //   }

    //   p.sort(function(a, b) {
    //       return parseFloat(b.total_votes) - parseFloat(a.total_votes);
    //   });
      
 
    //   this.total_votes = p.reduce((total, obj) => parseInt(obj.total_votes) + total, 0);
    //   p = p.map(pr => {
    //     pr.percentage = pr.total_votes/this.total_votes*100;
    //     pr.selected = this.myvotes[0].producers.indexOf(pr.owner) >= 0 ? true : false;
    //     return pr; 
    //   })
    //   this.producers = p;
    // },
        // addVote(prod){
    //   if(this.getNewVotes().length < 30){
    //     this.producers.find( p => p.owner === prod).selected = true;
    //   }
    //   else{
    //     alert(this.getNewVotes().length)
    //   }
      
    // },

    // removeVote(prod){
    //   this.producers.find(p => p.owner === prod).selected = false;
    // },
    // getNewVotes(){
    //   return this.producers.filter(p => p.selected == true ).map(s => s.owner);
    // },

  },
  created(){

  },
  watch:{
    getAccountName(v){
      if(v){
        this.init();
      }
    }
  }

}
</script>

<style>
.mygrid::after {
  content: "";
  flex: auto;
}
</style>
