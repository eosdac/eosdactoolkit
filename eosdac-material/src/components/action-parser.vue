<template>
<div>
  <div>Action {{activeSlide+1}}/{{actions.length}}</div>
  <div>{{actions[activeSlide].account}} > {{actions[activeSlide].name}}</div>
  <q-carousel class="text-white" @input="handleslide($event)">
    <q-carousel-slide v-for="(action, i) in actions" class="bg-dark" :key="i+'actionslide'">
      <pre>{{action}}</pre>
    </q-carousel-slide>

  </q-carousel>
</div>
</template>

<script>

export default {
  name: 'Actionparser',
  components: {

  },

  props: {
    actions: Array,
  },

  data () {
    return {
      activeSlide: 0

    }
  },

  methods: {
    handleslide(e){
      console.log('slide',e)
      this.activeSlide = e;
    }

  },



  mounted:function(){

  }

}
</script>

<style lang ="stylus">
@import '~variables'



</style>
