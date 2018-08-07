<template>
<q-inner-loading dark  v-bind:visible="visible" v-on:change="$emit('change', $event.target.visible)">
  <img class="animate-spin-reverse" style="max-height:25%;" src="/statics/eosdaclogo-spinner.png">
  <q-alert :message="text" color="primary">
    <span class="q-headline text-white">{{text}}</span>
  </q-alert>
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
