<template>
  <div v-if="partners.length">
    <a v-for="(p, i) in partners"  class="on-left" :key ="i" :href="p.url" target="_blank" style="font-size:25px; display:inline-block">
      <div class="row items-center">
      <img style="width:30px; margin-right:3px" :src="p.logo" />
      <span>{{p.name}}</span>
      </div>

    </a>


  </div>

</template>

<script>

import partnerbps from '../statics/credits.json'
export default {
  name: 'partnerbp',

  data() {
    return {
      partners : partnerbps.bps
    }
  },

  methods:{

  },
  mounted(){

  }

}
</script>

<style>

</style>
