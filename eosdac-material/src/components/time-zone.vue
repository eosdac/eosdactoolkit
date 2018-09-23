<template>
  <div>
    <span>Timezone: {{timedif}}</span>
  </div>
</template>

<script>
export default {
  name: 'TimeOffset',

  props: {
    offset: Number,
  },

  computed:{
    timedif(){
      let myUTCcoffset = new Date().getTimezoneOffset()/60;
      let timedif_in_hours = myUTCcoffset - (this.offset/60);

      let rel;
      if(timedif_in_hours < 0){
        rel = Math.abs(timedif_in_hours)+'h earlier';
      }
      if(timedif_in_hours > 0){
        rel = Math.abs(timedif_in_hours)+'h later';
      }
      if(timedif_in_hours == 0){
        rel = 'same';
      }

      return rel
    }
  },

  methods:{

 
  },
  mounted:{

  }
}
</script>

<style>

</style>
