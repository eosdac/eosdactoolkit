<template>
  <div class="q-mb-lg" v-if="custodians.length">
    <div class="q-display-1 q-mb-md">Custodian Board</div>
    <div  class="row  bg-dark2 shadow-5 round-borders q-pa-md  justify-between" >
      <div v-for="x in custodians" :key="x.cust_name" class="column items-center q-pa-xs">
        <div class="center_background_image" style="border-radius:50%; width:60px;height:60px" v-bind:style="{ 'background-image': `url(${x.profile.image})` }"></div>
        <router-link class="q-body-1 a2 q-mt-xs" :to="{path: '/profile/' + x.cust_name}" >
          <div class="q-ma-none">{{x.cust_name}}</div>
        </router-link>
      </div>
    </div>



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

.myflex_item:last-child{
  align-self: flex-start;
  background: blue;
}


</style>
