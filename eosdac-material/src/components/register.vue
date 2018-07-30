<template>
<q-card flat class="text-white">
  <Transaction ref="Transaction" v-on:done="registered()" />
  <q-card-title>
    <h4>Registration - Sign the Constitution</h4>
  </q-card-title>
  <q-card-main>
    <q-alert class="q-mb-md" icon="info" color="grey">{{statusText}}</q-alert>
    <p>This is the constitution of this DAC. In order to register as a DAC member you need accept the constitution.</p>
    <q-scroll-area class="markdown-body q-mb-xl" style="height:400px; width:100%;">
      <div v-html="constitution" class="fit"></div>
    </q-scroll-area>
    <q-checkbox class="q-ma-sm float-left" v-model="agree" label="I accept the Constitution" />
    <p class="float-right q-ma-sm">Constitution Hash:
      <q-chip dense color="primary">{{hash}}</q-chip>
    </p>
  </q-card-main>
  <q-card-actions style="width:100%;" align="end" class="q-mt-md float-right">
    <q-btn :disabled="!agree" @click="registerMember()" class="q-ma-md float-right" color="primary" label="Register" />
  </q-card-actions>
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-card>
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
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName'
    })
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      constitution: '',
      hash: '',
      statusText: '',
      agree: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    async checkRegistered() {
      let md = new MarkdownIt()
      this.loading = true
      this.loadingText = 'Checking member status...'
      let memberRegistration = await this.$store.dispatch('api/getRegistered')
      let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms')
      let memberterms = latestMemberTerms.rows[latestMemberTerms.rows.length - 1]
      if (memberRegistration) {
        if (memberterms.hash === memberRegistration.agreedterms) { //is regsitered
          this.$store.commit('account/ADD_REGISTRATION', findAccount.agreedterms)
          this.visible = false
          this.$emit('registrationDone')
        } else { //new version
          this.loadingText = 'Loading latest constitution...'
          let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
          this.hash = CryptoJS.MD5(getCt).toString()
          this.constitution = md.render(getCt)
          this.statusText = 'The constitution has been updated. Please sign the constitution to continue.'
        }
      } else { // not regsitered
        this.loadingText = 'Loading latest constitution...'
        let getCt = await this.loadConstitutionFromGithub(memberterms.terms)
        this.hash = CryptoJS.MD5(getCt).toString()
        this.constitution = md.render(getCt)
        this.statusText = 'You have not been registered as a member yet. Please sign the constitution to continue.'
      }
      this.loading = false
    },
    registerMember() {
      this.$refs.Transaction.newTransaction('memberreg', {
        sender: this.getAccountName,
        agreedterms: this.hash
      }, true)
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
