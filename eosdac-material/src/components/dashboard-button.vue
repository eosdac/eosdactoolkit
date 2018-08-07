<template>
  <q-btn :to="to" @click="(url)?  openLink(url) : false" style="font-weight: 300;" class="fit items-baseline" color="primary" size="xl">
    <div class="col-sm-3">
      <q-icon size="50px" class="float-left" :name="icon"></q-icon>
    </div>
    <div class="col-sm-8 text-right">
      {{text}}
    </div>
  </q-btn>
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'DashboardButton',
  props: {
    text: String,
    icon: String,
    to: String,
    url: String
  },
  data () {
    return {}
  },
  methods: {
    openLink (url) {
      openURL(url)
    }
  }
}
</script>

<style>
</style>
