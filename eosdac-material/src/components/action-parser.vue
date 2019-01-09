<template>
<div>
  <div class="row">
    <span class="q-pa-sm bg-primary">{{actions[activeSlide].account}}</span>
    <span class="q-pa-sm bg-p-light">{{actions[activeSlide].name}}</span>
    <span class="q-pa-sm bg-dark">
      <span class="on-left">Authorization</span>
      <span class="text-dimwhite">{{actions[activeSlide].authorization.map(a => a.actor+'@'+a.permission).join(', ')}}</span>
    </span>
  </div>
  <q-carousel class="text-white" v-model="activeSlide" @input="handleslide($event)">
    <q-carousel-slide v-for="(action, i) in actions" :key="i+'actionslide'">
      <!-- <div class="row">
        <span class="q-pa-sm bg-primary">{{action.account}}</span>
        <span class="q-pa-sm bg-p-light">{{action.name}}</span>
        <span class="q-pa-sm bg-dark">
          <span class="on-left">Authorization</span>
          <span class="text-dimwhite">{{action.authorization.map(a => a.actor+'@'+a.permission).join(', ')}}</span>
        </span>
      </div> -->
      <div class="row">

      </div>
      <div class="action_data_parser q-py-md" v-for="(key, i) in Object.keys(action.data)" :key="i+'actionkey'">
        <div><span>{{key}}: </span><span class="text-dimwhite">{{action.data[key]}}</span></div>
      </div>
    </q-carousel-slide>

  </q-carousel>

  <!-- controls -->
  <div v-if="actions.length > 1">
    <q-btn rounded color="primary" @click="prevAction()" icon="arrow_left" size="sm" />
    <span class="q-mx-sm">{{activeSlide+1}}/{{actions.length}}</span>
    <q-btn rounded color="primary" @click="nextAction()" icon="arrow_right" size="sm" />
  </div>

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
  computed :{

  },

  data () {
    return {
      activeSlide: 0

    }
  },

  methods: {
    nextAction(){
      if(this.activeSlide < this.actions.length-1) this.activeSlide++;
    },
    prevAction(){
      if(this.activeSlide > 0) this.activeSlide--;

    },
    parseActionData(actiondata){
      let keys = Object.keys(actiondata);
      let values = Object.values(actiondata);
      return values;
    },
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
.action_data_parser{
  border-bottom: 1px solid grey;
}

.action_data_parser:last-of-type{
  border-bottom:none;
}


</style>
