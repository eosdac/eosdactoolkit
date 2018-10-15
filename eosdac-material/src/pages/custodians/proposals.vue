<template>
<q-page class="text-white q-ma-lg">
  <div>proposals</div>
</q-page>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Proposals',
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      getactiveCustodians: 'api/getActiveCustodians'
      })

  },
  methods:{
    async getProposalsFromAllCustodians(){
      console.log(this.getactiveCustodians);
      this.getactiveCustodians.forEach(async c => {
        let p = await this.$store.dispatch('api/getProposalsFromAccount', c.cust_name);
        console.log(p)
      });
      
    }
  },
  mounted(){
    this.getProposalsFromAllCustodians();
  }

}
</script>

<style>
</style>
