<template>
  <div v-if="visible">
  <q-alert class="notifier fixed-bottom z-max" :color="color" text-color="white">
    <div class="row">
      <div class="col-xs-1">
        <q-icon flat size="30px" class="float-left on-left q-ma-sm" :name="icon"></q-icon>
      </div>
      <div class="col-xs-9">
        <div class="q-title">{{message}}</div>
      </div>
      <div class="col-xs-2">
        <q-icon flat size="40px" class="float-right no-padding" name="clear" @click.native="markSeen()"></q-icon>
      </div>
    </div>
  </q-alert>
</diV>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Notifier',
  computed: {
    ...mapGetters({
      getNotification: 'api/getNotification'
    })
  },
  data () {
    return {
      visible: false,
      icon: 'done',
      color: 'positive',
      message: '',
      detail: ''
    }
  },
  methods: {
    markSeen() {
      this.$store.commit('api/CLOSE_NOTIFICATION')
    }
  },
  watch: {
    getNotification () {
      if (this.getNotification.seen === false) {
        this.visible = true
      } else {
        this.visible = false
      }
      this.icon = this.getNotification.icon
      this.color = this.getNotification.color
      this.message = this.getNotification.message
      this.detail = this.getNotification.detail
    }
  }
}
</script>

<style>
</style>
