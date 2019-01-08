<template>
  <div v-if="partners.length">

    <div class="q-mb-md">Partners</div>
    <a v-for="(p, i) in partners"  class="on-left" :key ="i" :href="p.url" target="_blank" style="font-size:12px; display:inline-block">
      <div class="row items-center">
      <img style="width:20px; margin-right:3px" :src="p.logo" />
      <span>{{p.name}}</span>
      </div>

    </a>


  </div>

</template>

<script>

import partnerbps from '../statics/partner_bp.json'
export default {
  name: 'partnerbp',

  data() {
    return {
      partners : partnerbps
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
