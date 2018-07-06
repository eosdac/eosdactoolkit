<template>
<q-inner-loading  v-bind:visible="visible" v-on:change="$emit('change', $event.target.visible)">
  <img class="animate-spin-reverse float-left" alt="loading" style="max-height:50%; color: white;" src="~assets/eosdaclogo1-2000-605x605.png">
  <span class="q-headline">{{text}}</span>
</q-inner-loading>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  model: {
    prop: 'visible',
    event: 'change'
  },
  props: {
    visible: Boolean,
    text: String
  },
  data () {
    return {}
  }
}
</script>

<style>
</style>
