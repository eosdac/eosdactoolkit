<template>
  <div>
    <!-- <pre>{{custodians}}</pre> -->
    <span v-for="x in custodians" :key="x.cust_name">
      <div class="center_background_image" style="border-radius:50%; width:20px;height:20px" v-bind:style="{ 'background-image': `url(${x.profile.image})` }"></div>
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
        let p = await this.$profiles.getAvatars(custodians.map(c => c.cust_name) )
        p.forEach(pdb =>{
          let cand = custodians.find(x => x.cust_name === pdb._id);
          if(cand.profile === undefined){
            cand.profile = pdb;
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
