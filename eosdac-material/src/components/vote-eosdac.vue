<template>
<div v-if="getAccountName">

  <q-btn v-if="(!hasVotedForUs || votedecay) && !voted_with_proxy" color="dark" class="animate-pop" @click="openModal" >
    <q-icon name="icon-menu-3" class="on-left text-dimwhite"/> 
    <span>{{ $t('vote_eosdac.vote_for_eosdac') }}</span>
  </q-btn>
  <div v-else class="animate-fade" >
    <div v-if="!voted_with_proxy" ><q-icon  name="icon-ui-6" class="on-left text-dimwhite" style="margin-top:-5px"/><span>{{ $t('vote_eosdac.thank_you') }}</span></div>
    <div v-if="voted_with_proxy" >
      <q-icon  name="icon-ui-6" class="on-left text-dimwhite" style="margin-top:-5px"/>
      <span>{{ $t('vote_eosdac.voted_with_proxy') }}</span>
      <div class="q-caption text-center text-dimwhite">{{voted_with_proxy}}</div>
    </div>
  </div>

  <q-modal minimized v-model="votemodal" >
    <div class="bg-dark">
      <!-- header -->
      <div style="height:50px" class="bg-dark2 row items-center justify-between q-px-md">
        <span>{{ $t('vote_eosdac.vote_for_eosdac') }}</span>
        <q-icon class=" cursor-pointer" name="icon-ui-8" @click.native="votemodal = false" />
      </div>
      <!-- content -->
      <div class="q-pa-md">
        <div v-if="myvotes[0]" >
          <div>{{modal_msg}} </div>
          <div class="relative-position justify-start row q-pa-md q-mt-md bg-dark2 round-borders">
            <div class="q-mb-md row inline full-width justify-between items-center text-dimwhite">
              <div class="col-xs-12 col-md-2">{{ $t('vote_eosdac.votes') }} <span>{{myvotes[0].producers.length}}/30</span></div>
              <div class="col-xs-12 col-md-4">
                <div class="q-caption q-my-xs">{{ $t('vote_eosdac.voting_power') }} <span>{{(100-votedecay_percent).toFixed(2)}}%</span></div>
                <q-progress :percentage="100-votedecay_percent" />
              </div>
            </div>
            <span v-for="(prod, i) in myvotes[0].producers" :key="i">
              <q-chip v-if="prod == eosdacBP" style="width:150px" class="text-center q-ma-xs" closable @hide="removeVote(i)" color="positive">{{prod}}</q-chip>
              <q-chip v-else style="width:150px" class="text-center q-ma-xs"  closable @hide="removeVote(i)" color="dark">{{prod}}</q-chip>
            </span>
          </div>
          <div class="row justify-end q-mt-md items-center" style="height:30px">
            <div  class="on-left animate-fade" v-if="btn_feedback">{{btn_feedback}}</div>
            <q-btn :label="$t('vote_eosdac.confirm')" color="primary" @click="castVotes" @blur.native="btn_feedback=''" />
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
      eosdacBP : this.$configFile.network.tokenContract.name=="kasdactokens"?"eosdacserval":"eosdacserver",
      votedecay: false,
      votedecay_percent: 0,
      btn_feedback:'',
      voted_with_proxy: false

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
      this.myvotes = await this.$store.dispatch('api/getProducerVotes', {member: this.getAccountName});
      // this.myvotes = await this.$store.dispatch('api/getProducerVotes', {member: 'lukeeosproxy'});

      // console.log('my votes', JSON.stringify(this.myvotes) )

      if(!this.myvotes[0]){//never voted hack
        this.myvotes[0]={producers: [], staked:0, last_vote_weight:0, is_proxy: 0, proxy:''};
      }

      if(this.myvotes[0].proxy){
        this.voted_with_proxy = this.myvotes[0].proxy;// =true
        let proxy_votes = await this.$store.dispatch('api/getProducerVotes', {member: this.myvotes[0].proxy});
        //console.log('proxy votes:', proxy_votes[0].producers);
        if(proxy_votes[0]) this.myvotes[0].producers = proxy_votes[0].producers;
        
      }

      this.hasVotedForUs = this.myvotes[0].producers.indexOf(this.eosdacBP) >= 0 ? true : false;

      let vote_weight_now = this._calculateVoteWeight(this.myvotes[0].staked)*100000000000000000;
      let last_vote_weight = this.myvotes[0].last_vote_weight*100000000000000000;

      //if account is a proxy
      if(this.myvotes[0].is_proxy) last_vote_weight -= this.myvotes[0].proxied_vote_weight*100000000000000000;
      // console.log('last vote weight', last_vote_weight)
      //only calculate vote decay if previously voted
      if(last_vote_weight != 0){
        this.votedecay_percent = ((Math.abs((last_vote_weight) - (vote_weight_now)) /(((last_vote_weight)+(vote_weight_now))/2))*100).toFixed(2);
      }
      // console.log('decay percent', this.votedecay_percent)
      this.votedecay = this.votedecay_percent > 0 ? true : false;


    },

    castVotes(){
        let votes = this.myvotes[0].producers;
        if(votes.length >30){
          this.btn_feedback = this.$t('vote_eosdac.remove_vote');
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
        this.modal_msg = this.$t('vote_eosdac.added_to_list');
        //move this to html
        if(this.myvotes[0].producers.length >30){
          this.modal_msg += this.$t('vote_eosdac.please_delete', {eosdac_bp: this.eosdacBP });
        }
      }
      else{
        this.modal_msg = this.$t('vote_eosdac.thank_you_for', {eosdac_bp: this.eosdacBP })+' ';
        if(this.votedecay){
          this.modal_msg += this.$t('vote_eosdac.vote_decayed');
        }
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
