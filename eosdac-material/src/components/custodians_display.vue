<template>
  <div>{{custodians}}</div>
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
  },

  mounted:function(){
    if(this.getActiveCustodians){
      this.custodians = this.getActiveCustodians.map(c => c.cust_name);
    }
    
    
  },
  watch:{
    getActiveCustodians: function(){
      this.custodians = this.getActiveCustodians.map(c => c.cust_name);
    }
  }

}
</script>

<style lang ="stylus">
@import '~variables'



</style>
