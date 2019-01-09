<template>
<q-page class="text-white bg-blue">
  <div class="retro_banner_color"></div>
  <div class="q-pa-md">

    <div>
      <q-btn v-if="isPlaying" icon="volume_up" @click="pauseAudio" />
      <q-btn v-else icon="volume_off" @click="playAudio" />
    </div>
    <div class="row bg-dark q-pa-md round-borders shadow-5 partnerbox">
      <partnerbps />
    </div>
  </div>



</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import Partnerbps from 'components/partner_bp'
const audio = new Audio('../statics/sounds/retro.mp3');
audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

import {
  mapGetters
} from 'vuex'
export default {
  name: 'credits',
  components: {
      Partnerbps

  },
  data() {
    return {
      isPlaying: true

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      // getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    playAudio(){
      audio.play();
      this.isPlaying = true;
    },
    pauseAudio(){
      audio.pause();
      this.isPlaying = false;
    }

  },
  
  mounted(){
    this.playAudio();
  },

  beforeRouteLeave (to, from, next) {
    this.pauseAudio();
    next();
  }
}
</script>

<style>
.retro_banner_color{
  height:50px;
  background-image: url('../statics/gifs/colors.gif');
}
</style>
