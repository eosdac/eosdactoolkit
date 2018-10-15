<template>
<q-page class="text-white q-ma-lg">
  <div>proposals</div>
</q-page>
</template>

<script>
export default {
  name: 'Proposals',
  methods:{
    async getProposalsFromAccount(){
      let p = await this.$store.dispatch('api/getProposalsFromAccount', "kas");
      if(p){
        console.log(p);
      }
    }
  },
  mounted(){
    this.getProposalsFromAccount();
  }

}
</script>

<style>
</style>
