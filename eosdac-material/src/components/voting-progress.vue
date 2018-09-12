<template>
  <div class="full-width">
    <span class="uppercase">{{ $t("vote_custodians.voting_progress") }} <span class="text-dimwhite on-right on-left"> {{ voting_progress }}%</span></span>
    <span class="q-body-1 text-dimwhite text-italic">(The DAC will be activated at 15%)</span>
    <q-progress animate stripe class="round-borders votingprogress_bar q-mt-md" :style="{height: height}" color="positive" :percentage="voting_progress" />
    <span v-if="!loading" class="q-caption">update in {{update_in_seconds}} seconds</span>
    <span v-else class="q-caption">loading...</span>
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
      loading : false
      
    }
  },

  methods:{
    //get voting progress from chain
    async getContractState() {
      this.loading = true;
      let totalsupply = this.$configFile.network.tokenContract.totalSupply;
      let state = await this.$store.dispatch('api/getContractState', {contract: this.$configFile.network.custodianContract.name})
      if(state){
        this.voting_progress = state.total_weight_of_votes/totalsupply/100;
      }
      this.loading = false;

    },
    intervaller (i){
      let oldi = i;
      var int = setInterval(() => {
        this.update_in_seconds = i;
        i--;
        if(i == -1){
          clearInterval(int);
          console.log('xxxx');
          this.getContractState();
          this.intervaller(oldi);
          // this.getContractState();
        }
      }, 1000);

    }

  },
  mounted(){
    this.getContractState();
    //update every 60 seconds
    this.intervaller(60);
  }

}
</script>

<style>
.votingprogress_bar .q-progress-track{
  background:white;
}
</style>
