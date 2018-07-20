<template>
        <q-card flat class="text-white">
          <q-card-title>
            Registration - Sign the Constitution
          </q-card-title>
          <q-card-main>
        <p class="text-truncate q-ma-md">This is the constitution of this DAC. In order to register as a DAC member you need accept the constitution.</p>
          <q-scroll-area class="markdown-body q-mb-xl constitution" style="height:300px; width:800px;">
            <div v-html="constitution"></div>
          </q-scroll-area>
<q-checkbox class="q-ma-sm float-left" v-model="agree" label="I accept the Constitution" />
          <p class="float-right q-ma-sm">Constitution Hash: <q-chip dense color="primary">{{hash}}</q-chip></p>
          </q-card-main>
        <q-card-actions style="width:100%;" align="end" class="q-mt-md float-right">
          <q-btn :disabled="!agree" @click="registerMember()" class="q-ma-md float-right" color="primary" label="Register" />
        </q-card-actions>
      <Transaction ref="Transaction" v-on:done="registered()"/>
      <LoadingSpinner :visible="loading" :text="loadingText" />
</q-card>
</template>

<script>
import CryptoJS from 'crypto-js'
import MarkdownIt from 'markdown-it'
import LoadingSpinner from 'components/loading-spinner'
import { mapGetters } from 'vuex'
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
  data () {
    return {
      loading: false,
      loadingText: '',
      visible: false,
      constitution: '', //where to get it from ?
      hash: '',
      agree: false
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    registered () {
      this.$store.dispatch('api/getRegistered').then((res) => {
        let findAccount = res.rows.find(findAccount => {
          return findAccount.sender === this.getAccountName
        })
        if (findAccount) {
          this.$store.commit('account/ADD_REGISTRATION',findAccount.agreedterms)
          this.visible = false
          this.$emit('registrationDone')
        }
      }, (err) => {
      })
    },
    registerMember () {
      this.$refs.Transaction.newTransaction('memberreg', {sender: this.getAccountName, agreedterms: this.hash}, true)
    },
    loadConstitutionFromGithub () {
      this.loading = true
      this.loadingText = 'Retrieving constitution...'
      this.$axios.get('https://cdn.rawgit.com/nanonano7/8ae8d59dee0fff9a569a454839a3f60e/raw/40dc7890c14821edba5525555b1cfa7a31a1e3ef/Constitution.md').then((response) => {
        let md = new MarkdownIt()
        this.hash = CryptoJS.MD5(response.data).toString()
        this.constitution = md.render(response.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted () {
    this.loadConstitutionFromGithub()
  }
}
</script>

<style>
.constitution {
  max-height: 500px;
}
</style>
