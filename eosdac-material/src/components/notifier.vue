<template>
<div v-if="visible && getAccount">
  <transition-group appear enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
    <q-alert key="alert" class="notifier fixed-bottom z-max" v-bind:class="{ 'drawer-margin': drawer }" :color="color" :text-color="textColor" @click.native="markSeen()">
      <div class="row justify-center items-center relative-position">
        <div >
          <q-icon flat size="30px" class="float-left on-left q-ma-sm" :name="icon"></q-icon>
        </div>
        <div>
          <div class="q-title">{{ message }}</div>
          <span>{{ details }}</span>
          
        </div>
        <div><q-btn class="on-right" dense v-if="linkText" @click="openLink(linkUrl)" :text-color="color" :color="textColor">{{ linkText }}</q-btn></div>
        <!-- <div class="absolute-top-right">
          <q-icon flat size="40px" class="float-right no-padding cursor-pointer" name="clear" @click.native="markSeen()"></q-icon>
        </div> -->
      </div>
    </q-alert>
  </transition-group>
</div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import {
  openURL
} from 'quasar'
export default {
  name: 'Notifier',
  props: {
    drawer: Boolean
  },
  computed: {
    ...mapGetters({
      getNotification: 'api/getNotification',
      getAccount: 'account/getAccount'
    })
  },
  data() {
    return {
      visible: false,
      icon: 'done',
      color: 'positive',
      message: '',
      details: '',
      textColor: 'white',
      linkText: '',
      linkUrl: ''
    }
  },
  methods: {
    openLink(url) {
      if (url.includes('.')) {
        openURL(url)
      } else {
        this.$router.push('/explorer/' + url)
      }
    },
    markSeen() {
      this.$store.commit('api/CLOSE_NOTIFICATION')
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
  },
  watch: {
    getNotification() {
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
      this.linkText = this.getNotification.linkText
      this.linkUrl = this.getNotification.linkUrl
      if (this.getNotification.autoclose) {
        this.sleep(this.getNotification.autoclose * 1000).then(() => {
          this.markSeen();
        })
      }
    }
  }
}
</script>

<style>

</style>
