<template>
<q-inner-loading  v-bind:visible="visible" v-on:change="$emit('change', $event.target.visible)">
  <img class="animate-spin-reverse" style="max-height:25%;" src="/statics/eosdaclogo-spinner.png">
  <span class="q-headline text-black">{{text}}</span>
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
