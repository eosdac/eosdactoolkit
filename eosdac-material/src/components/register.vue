<template>
<div v-if="visible" class="justify-center relative-position">
  <div v-if="!success">
    <div v-if="!queryError" class="row relative-position">
      <div class="col-12 relative-position">
        <Transaction ref="Transaction" v-on:done="checkRegistered(true)" />
        <h6 class="text-white q-mt-none q-mb-lg">Registration - Sign the Constitution</h6>
        <q-alert v-if="statusText" class="q-mb-md" icon="info" color="grey">{{statusText}}</q-alert>
        <p class="text-white">In order to become a Member of eosDAC you have to agree and sign the Constitution.
          <q-btn dense flat @click="toggleFullscreen = true" class="p-light q-ma-none">(Fullscreen)</q-btn>
        </p>
        <q-scroll-area v-if="constitution" class="markdown-body q-mb-md" v-bind:class="[toggleFullscreen ? fullscreen : '']" style="height:200px;padding:10px;">
          <q-btn v-if="toggleFullscreen" @click="toggleFullscreen = false" class="fixed-top-right no-shadow q-mt-md" size="lg" color="primary" icon="icon-ui-8" label="Close" />
          <div v-html="constitution" class="fit"></div>
        </q-scroll-area>
      </div>
      <div class="col-12">
        <q-checkbox class=" float-left text-white" color="white" v-model="agree">
          I accept the Constitution
        </q-checkbox>
        <p class="float-right text-white">Constitution Hash:
          <q-chip dense color="primary">{{hash}}</q-chip>
        </p>
      </div>
      <div class="col-12">
        <q-btn :disabled="!agree" @click="registerMember()" style="min-width: 20%;" class="float-right no-shadow q-mt-md" color="primary" label="Register" />
      </div>
      <LoadingSpinner :visible="loading" :text="loadingText" />
    </div>
    <div v-else class="col-lg-12 col-xl-8 relative-position">
      <q-alert :actions="[{ label: 'Try again', handler: () => { checkRegistered() } }]" message="Could not retrieve member status" class="text-truncate q-ma-xl" icon="info" color="grey" />
    </div>
  </div>
  <div class="row q-px-sm" v-else>
    <div class="col-12">
      <q-alert icon="icon-ui-6" color="positive">
        <span v-if="altMessage">Congratulations! You are now registered as an eosDAC Member.</span>
        <span v-else>You are already registered as a eosDAC Member.</span>
      </q-alert>
    </div>
  </div>
</div>
</template>

<script>
import CryptoJS from 'crypto-js'
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
import Transaction from 'components/transaction'
export default {
  name: 'Register',
  components: {
    LoadingSpinner,
    Transaction
  },
  props: {
    visible: Boolean
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getImported: 'account/getImported',
      getFirstReg: 'account/getFirstReg'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      constitution: '',
      hash: '',
      statusText: '',
      agree: false,
      queryError: false,
      toggleFullscreen: false,
      success: false,
      altMessage: false,
      fullscreen: {
        active: true,
        'fullscreen': true,
        'fixed-center': true,
        'fit': true
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.checkRegistered()
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async checkRegistered(wait) {
      try {
        let md = new MarkdownIt()
        this.loading = true
        this.loadingText = 'Checking member status...'
        this.queryError = false
        if (wait) {
          await this.sleep(2000)
        }
        let memberRegistration = await this.$store.dispatch('api/getRegistered')
        console.log('Query member registration')
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms')
        console.log('Query latest terms')
        let memberterms = latestMemberTerms
        if (memberRegistration) {
          if (memberterms.version === memberRegistration.agreedterms) { //is regsitered
            if (this.getFirstReg) {
              this.altMessage = true
              console.log('First time registration')
              this.$store.commit('account/SET_FIRST_REGISTRATION')
            }
            console.log('Is member. User version:', memberRegistration.agreedterms, 'Latest version', memberterms.version)
            //this.$emit('registrationDone')
            this.$store.commit('account/ADD_REGISTRATION', memberRegistration.agreedterms)
            this.success = true
          } else { //new version
            this.$store.commit('account/REMOVE_REGISTRATION')
            console.log('New version available. User version:', memberRegistration.agreedterms, 'Latest version', memberterms.version)
            this.loadingText = 'Loading latest constitution...'
            let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
            this.hash = CryptoJS.MD5(getCt).toString()
            this.constitution = md.render(getCt)
            this.statusText = 'The constitution has been updated. Please sign the constitution to continue.'
          }
        } else { // not regsitered
          this.$store.commit('account/REMOVE_REGISTRATION')
          console.log('Not registered as a member')
          this.loadingText = 'Loading latest constitution...'
          let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
          this.hash = CryptoJS.MD5(getCt).toString()
          this.constitution = md.render(getCt)
          this.statusText = ''
        }
      } catch (err) {
        console.log(err)
        this.queryError = true
      } finally {
        this.loading = false
        this.$emit('done')
      }
    },
    registerMember() {
      this.$refs.Transaction.newTransaction('memberreg', {
        sender: this.getAccountName,
        agreedterms: this.hash
      }, false)
    },
    async loadConstitutionFromGithub(url) {
      try {
        let constitution = await this.$axios.get(url)
        return constitution.data
      } catch (err) {
        throw err
      }
    }
  }
}
</script>

<style>
.constitution {
  max-height: 500px;
}
</style>
