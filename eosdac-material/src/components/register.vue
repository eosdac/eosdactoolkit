<template>
  <div v-show="!getRegistered && getAccountName && getImported" class="row justify-center">
    <div v-if="!queryError" class="col-lg-12 col-xl-8 relative-position">
      <q-card flat class="text-white">
        <Transaction ref="Transaction" v-on:done="checkRegistered()" />
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
    </div>
    <div v-else class="col-lg-12 col-xl-8 relative-position">
      <q-alert :actions="[{ label: 'Try again', handler: () => { checkRegistered() } }]" message="Could not retrieve member status" class="text-truncate q-ma-xl" icon="info" color="grey" />
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
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getImported: 'account/getImported'
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
      registered: false,
      queryError: false
    }
  },
  mounted () {
    if (this.getAccountName) {
      this.checkRegistered()
    }
  },
  watch: {
    getAccountName (val) {
      if (val) {
        this.checkRegistered()
      }
    }
  },
  methods: {
    async checkRegistered() {
      try {
        let md = new MarkdownIt()
        this.loading = true
        this.loadingText = 'Checking member status...'
        this.queryError = false
        let memberRegistration = await this.$store.dispatch('api/getRegistered')
        console.log('Query member registration')
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms')
        console.log('Query latest terms')
        let memberterms = latestMemberTerms.rows[latestMemberTerms.rows.length - 1]
        if (memberRegistration) {
          if (memberterms.version === memberRegistration.agreedterms) { //is regsitered
            console.log('Is member. User version:',memberRegistration.agreedterms,'Latest version',memberterms.version)
            //this.$emit('registrationDone')
            this.$store.commit('account/ADD_REGISTRATION')
          } else { //new version
            this.$store.commit('account/REMOVE_REGISTRATION')
            console.log('New version available. User version:',memberRegistration.agreedterms,'Latest version',memberterms.version)
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
          this.statusText = 'You have not been registered as a member yet. Please sign the constitution to continue.'
        }
      } catch (err) {
        this.queryError = true
      } finally {
        this.loading = false
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
