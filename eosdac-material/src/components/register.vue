<template>
<div v-if="visible" class="justify-center relative-position q-pa-md">
  <div v-if="!success">
    <div v-if="!queryError" class="row relative-position">
      <div class="col-12 relative-position">
        <Transaction ref="Transaction" v-on:done="checkRegistered(true)" />
        <h6 class="text-white q-mt-none q-mb-lg">{{ $t('register.registration_sign_the_constitution') }}</h6>
        <q-alert v-if="statusText" class="q-mb-md" icon="info" color="grey">{{ $t(statusText) }}</q-alert>
        <p class="text-white">{{ $t('register.must_sign_constitution') }}
          <q-btn dense flat @click="toggleFullscreen = true" class="p-light q-ma-none">({{ $t('register.fullscreen') }})</q-btn>
        </p>
        <q-scroll-area v-if="constitution" class="markdown-body q-mb-md" v-bind:class="[toggleFullscreen ? fullscreen : '']" style="height:200px;padding:10px;">
          <q-btn v-if="toggleFullscreen" @click="toggleFullscreen = false" class="fixed-top-right no-shadow q-mt-md" size="lg" color="primary" icon="icon-ui-8" :label="$t('register.close')" />
          <div v-html="constitution" class="fit"></div>
        </q-scroll-area>
      </div>
      <div class="col-12">
        <q-checkbox class=" float-left text-white" color="white" v-model="agree">
          {{ $t('register.i_accept_the_constitution') }}
        </q-checkbox>
        <p class="float-right text-white">{{ $t('register.constitution_hash') }}:
          <q-chip dense color="primary">{{hash}}</q-chip>
        </p>
      </div>
      <div class="col-12">
        <q-btn :disabled="!agree" @click="registerMember()" style="min-width: 20%;" class="float-right no-shadow q-mt-md" color="primary" :label="$t('register.register')" />
      </div>
      <LoadingSpinner :visible="loading" :text="$t(loadingText)" />
    </div>
    <div v-else class="col-lg-12 col-xl-8 relative-position">
      <q-alert :actions="[{ label: $t('register.try_again'), handler: () => { checkRegistered() } }]" :message="$t('register.could_not_retrieve_member_status')" class="text-truncate q-ma-xl" icon="info" color="grey" />
    </div>
  </div>
  <div class="row q-px-sm" v-else>
    <div class="col-12">
      <q-alert icon="icon-ui-6" color="positive">
        <span v-if="altMessage">{{ $t('register.congratulations_registered') }}</span>
        <span v-else>{{ $t('register.already_registered') }}</span>
      </q-alert>
    </div>
  </div>
</div>
</template>

<script>
import CryptoJS from 'crypto-js'
import marked from 'marked'
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
      this.checkRegistered();

    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    async checkRegistered(wait) {
      try {
        this.loading = true
        this.loadingText = 'register.checking_status'
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
            this.checkMemberRoles();///////////////////////// WIP add this to dedicated component!
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
            this.loadingText = 'register.loading_latest_constitution'
            let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
            this.hash = CryptoJS.MD5(getCt).toString()
            this.constitution = marked(getCt, {sanitize: true})
            this.statusText = 'register.updated_constitution'
          }
        } else { // not regsitered
          this.$store.commit('account/REMOVE_REGISTRATION')
          console.log('Not registered as a member')
          this.loadingText = 'register.loading_latest_constitution'
          let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
          this.hash = CryptoJS.MD5(getCt).toString()
          this.constitution = marked(getCt, {sanitize: true})
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
    async checkMemberRoles(){
      this.$store.dispatch('api/getIsCandidate');
      this.$store.dispatch('api/getIsCustodian');
    },
    registerMember() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.tokenContract.name,'memberreg', {
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
