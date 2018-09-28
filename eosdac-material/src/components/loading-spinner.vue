<template>
<q-inner-loading dark  v-bind:visible="visible" v-on:change="$emit('change', $event.target.visible)">
  <q-spinner-oval color="primary" style="opacity:1" size="220px" />
  <q-alert class="q-mt-md" :message="text" color="primary">
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
