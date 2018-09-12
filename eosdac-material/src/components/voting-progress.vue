<template>
  <div class="full-width">
    <span class="uppercase">{{ $t("vote_custodians.voting_progress") }} <span class="text-dimwhite on-right on-left"> {{ voting_progress }}%</span></span>
    <span class="q-body-1 text-dimwhite text-italic">(The DAC will be activated at 15%)</span>
    <q-progress animate stripe class="round-borders votingprogress_bar q-my-xs" :style="{height: height}" color="positive" :percentage="voting_progress" />
    <span v-if="!loading" class="q-caption float-right">update in {{update_in_seconds}} seconds</span>
    <span v-else class="q-caption float-right">loading...</span>
  </div>
</template>

<script>
export default {
  name: 'VotingProgress',

  props: {
    height: String

  },
  data () {
    return {
      voting_progress : 0,
      update_in_seconds:0,
      loading : false,
      timer : false
      
    }
  },

  methods:{
    //get voting progress from chain
    async getContractState() {
      this.loading = true;
      let totalsupply = this.$configFile.network.tokenContract.totalSupply*10000;
      let state = await this.$store.dispatch('api/getContractState', {contract: this.$configFile.network.custodianContract.name})
      if(state){
        this.voting_progress = state.total_weight_of_votes/totalsupply*100;
      }
      this.loading = false;

    },
    intervaller (i){
      let oldi = i;
      this.timer = setInterval(() => {
        this.update_in_seconds = i;
        i--;
        if(i == -1){
          clearInterval(this.timer);
          this.timer = false;
          this.getContractState();
          this.intervaller(oldi);

        }
      }, 1000);

    }

  },
  mounted(){
    this.getContractState();
    //update every 60 seconds
    this.intervaller(60);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = false;
    
  },

}
</script>

<style>
.votingprogress_bar .q-progress-track{
  background:white;
}
</style>
