<template>
<q-modal class="relative-position" @hide="close()" v-model="active" content-classes="fit bg-dark2" :content-css="{maxWidth: '900px', maxHeight: '610px'}">
  <q-scroll-area class="fit" :thumb-style="{background: '#4A1289', opacity: 0.5}">
    <div class="row full-height">
      <div class="col-12">
        <q-tabs v-model="selectedTab" no-pane-border align="left">
          <q-tab v-show="initialmode === 'signin'" @click.native="initialmode === 'signin' ? mode = 'signin': mode = mode" slot="title" name="signin" :label="$t('multi_modal.sign_in')" />
          <q-tab @click.native="mode = 'register'" slot="title" name="register" :label="$t('multi_modal.register_as_dac_member')" />
          <q-tab class="absolute-right" @click.native="close()" slot="title" name="close" icon="icon-ui-8" />
        </q-tabs>
        <q-stepper v-model="step" color="white" ref="stepper" contractable no-header-navigation class="bg-dark no-shadow no-line" v-bind:class="{'registered-step': getRegistered && step === 'step3' }">
          <!--node-->
          <q-step style="display:none;" :order="1" active-icon="icon-register-1" done-icon="icon-register-1" icon="icon-register-1" default :title="$t('settings.API_endpoint')" name="step1" />
          <!--scatter-->
          <q-step style="display:none;" :order="2" title="Authentication" name="step2" active-icon="icon-register-2" done-icon="icon-register-2" icon="icon-register-2" />
          <!--register-->
          <q-step style="display:none;" :order="3" v-if="mode !== 'signin'" active-icon="icon-register-3" done-icon="icon-register-3" icon="icon-register-3" :title="$t('multi_modal.registration')" name="step3" />
        </q-stepper>
      </div>
      <div class="col-12">
        <NodeSelector v-if="initialmode !== 'sign' && active && step === 'step1'" setup v-on:done="step ='step2'" />
        <ScatterSignIn :skipSelection="initialmode === 'signin'" v-if="step === 'step2'" v-on:done="ifReg()" />
        <Register v-if="step === 'step3'" :visible="selectedTab === 'register'" ref="reg" v-on:done="(mode === 'signin')? close(): ''" />
      </div>
    </div>
    <!-- end row full height -->
  </q-scroll-area>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-modal>
</template>

<style lang="stylus">
@import '~variables'
.no-line
  > .q-stepper-step
    background $dark2;
  > .q-stepper-header
    > .q-stepper-tab.step-waiting
      color: white !important;
    > .q-stepper-tab.step-done
      color $positive
    > .q-stepper-tab.step-done.step-colored
      > .q-stepper-dot
        > span
          > i
            color $positive
      > .q-stepper-line:after
        background $positive
      > .q-stepper-line:before
        background $positive
    > .q-stepper-tab
      > .q-stepper-dot
        background none
        size 24px
    > .q-stepper-tab:last-child
      > .q-stepper-line:after
        display none
.registered-step
  > .q-stepper-header
    > .q-stepper-tab:last-child
      > .q-stepper-dot
        > .row
          > .q-icon
            color $positive
      > .q-stepper-dot:before
        background $positive
      > .q-stepper-label
        color $positive
</style>
<script>
import {
  mapGetters
} from 'vuex'
import LoadingSpinner from 'components/loading-spinner'
import NodeSelector from 'components/nodeselector'
import ScatterSignIn from 'components/scatter-signin'
import Register from 'components/register'
export default {
  name: 'MultiModal',
  components: {
    LoadingSpinner,
    NodeSelector,
    ScatterSignIn,
    Register
  },
  computed: {
    ...mapGetters({
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getCurrentConnectionStatus: 'api/getCurrentConnectionStatus',
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getImported: 'account/getImported'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: 'initialize.loading_text',
      active: false,
      step: 'step1',
      scatterError: false,
      scatterErrorText: '',
      regCheck: false,
      selectedTab: '',
      mode: 'register',
      initialmode: ''
    }
  },
  watch: {
    getCurrentConnectionStatus(val) {
      if (!val) {
        this.step = 'step1'
      }
    }
  },
  methods: {
    init(mode) {
      this.active = true
      this.mode = mode
      this.initialmode = mode
      if (this.mode !== 'sign') {
        if (this.mode === 'register') {
          this.selectTab('register')
        } else {
          this.selectTab('signin')
        }

        if (this.getAccountName) {
          this.step = 'step3'
        } else {
          if (this.getCurrentConnectionStatus) {
            this.step = 'step2'
          } else {
            this.step = 'step1'
          }
        }
      } else {
        this.selectTab('register')
        this.$refs.stepper.goToStep('step3')
      }
    },
    ifReg() {
      this.regCheck = true
      this.$refs.stepper.goToStep('step3')
    },
    close() {
      Object.assign(this.$data, this.$options.data())
      this.active = false
    },
    selectTab(name) {
      this.selectedTab = name
    }
  }
}
</script>
