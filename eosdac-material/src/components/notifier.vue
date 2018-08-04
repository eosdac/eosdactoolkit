<template>
  <div v-if="visible">
  <q-alert class="notifier fixed-bottom z-max" v-bind:class="{ 'drawer-margin': drawer }" :color="color" :text-color="textColor">
    <div class="row">
      <div class="col-xs-1">
        <q-icon flat size="30px" class="float-left on-left q-ma-sm" :name="icon"></q-icon>
      </div>
      <div class="col-xs-9">
        <div class="q-title">{{message}}</div>
        {{details}}
      </div>
      <div class="col-xs-2">
        <q-icon flat size="40px" class="float-right no-padding" name="clear" @click.native="markSeen()"></q-icon>
      </div>
    </div>
  </q-alert>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Notifier',
  props: {
    drawer: Boolean
  },
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
      details: '',
      textColor: 'white'
    }
  },
  methods: {
    markSeen() {
      this.$store.commit('api/CLOSE_NOTIFICATION')
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
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
      this.details = this.getNotification.details
      this.textColor = this.getNotification.textColor || 'white'
      if (this.getNotification.autoclose) {
        sleep(this.getNotification.autoclose * 1000).then(() => {
          this.markSeen()
        })
      }
    }
  }
}
</script>

<style>
.drawer-margin {
  margin-left:300px;
}
</style>
