<template>
    <q-progress animate stripe class="round-borders votingprogress" :style="{height: height}" color="positive" :percentage="voting_progress" />
</template>

<script>
export default {
  name: 'VotingProgress',

  props: {
    height: String

  },
  data () {
    return {
      voting_progress : 10
      
    }
  },

  methods:{
    //get voting progress from chain

  }
}
</script>

<style>
.votingprogress .q-progress-track{
  background:white;
}
</style>
