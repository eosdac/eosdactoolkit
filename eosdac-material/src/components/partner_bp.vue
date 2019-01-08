<template>
  <div v-if="partners.length">
    <div v-for="(p, i) in partners" :key="i">
      {{p.name}}
    </div>
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
