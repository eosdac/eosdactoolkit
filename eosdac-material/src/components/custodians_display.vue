<template>
  <div>
    <span v-for="x in custodians" :key="x.cust_name">
      <span v-if="x.profile && x.profile.image">{{x.profile.image}}</span>
      {{x.cust_name}}
    </span>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'custodianDisplay',

  props: {
    data: Object,
  },

  data () {
    return {
      custodians:[]

    }
  },
  computed: {
    ...mapGetters({
      getActiveCustodians: 'api/getActiveCustodians'
    })
  },

  methods: {
      //get all custodians + profiles and display avatar
      async setCustodians () {
        let custodians;
        if(!this.getActiveCustodians){
          custodians = (await this.$store.dispatch('api/getCustodians' ) );
        }
        else{
          custodians = this.getActiveCustodians;
        }
        let p = await this.$store.dispatch('api/getProfileData2', {accountname: custodians.map(c => c.cust_name)} );
        console.log(p)
        p.forEach(pdb =>{
          let cand = custodians.find(x => x.cust_name === pdb._id);
          if(cand.profile === undefined){
            cand.profile = pdb.profile;
          }
        })
        this.custodians = custodians;
      }

  },

  mounted:function(){
    this.setCustodians();
  }

}
</script>

<style lang ="stylus">
@import '~variables'



</style>
