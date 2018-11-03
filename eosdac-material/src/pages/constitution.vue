<template>
<q-page class="text-white q-pa-md">
  <div>
    <div>{{latestMemberTerms.terms}}</div>
    <div>{{latestMemberTerms.hash}}</div>
    <div>{{latestMemberTerms.version}}</div>
    <q-btn  @click="signConstitution()"  color="primary" label="Sign" />

  </div>
  <div class="row justify-center q-mt-sm">
    <div class="col-lg-12 col-xl-auto shadow-5">
      <div class="bg-dark2 q-pa-md">
        <q-toggle class="float-right" color="p-light" v-model="white_constitution" left-label :label="$t('constitution.switch_contrast')" /></div>
      <div v-if="!isloading" class="q-pt-md round-borders  bg-dark2">
        <div v-bind:class="{ overwrite: !white_constitution }" class="markdown-body" v-html="constitution"></div>
      </div>
    </div>
  </div>
  <Transaction ref="Transaction" v-on:done="checkRegistered" />
  <LoadingSpinner :visible="isloading" :text="$t('constitution.loading_constitution')" />
</q-page>
</template>

<style lang="stylus">
@import '~variables'

.overwrite {
  background: none !important;
  color: rgba(255,255,255,0.8) !important;
  // transition: all 0.1s linear;
}
.overwrite h1, .overwrite h2{
  color: #fff;
  // transition: all 0.1s linear;
}
.overwrite td, .overwrite th {
  background: $dark !important;
  // transition: all 0.1s linear;
}

</style>

<script>
import CryptoJS from 'crypto-js'
import marked from 'marked'
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'
import {
  mapGetters
} from 'vuex'
export default {
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

      isloading: false,
      constitution: '',
      white_constitution: false,

      md5_constitution: '',
      latestMemberTerms:{}

    }
  },


  methods: {

    async getConstitution() {
      this.isloading = true;
      try {
        this.latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
        let getCt = await this.loadConstitutionFromGithub(this.latestMemberTerms.terms);
        this.md5_constitution = CryptoJS.MD5(getCt).toString();

        //check if the fetched constitution matches the contract hash
        if(this.md5_constitution === this.latestMemberTerms.hash){
          console.log('Constitution verified! Hashes match!')
        }
        this.constitution = marked(getCt, {sanitize: true})
        this.isloading = false;

      } catch (e) {
        console.log(e);
        this.isloading = false;
      }
    },

    async loadConstitutionFromGithub(url) {
      try {
        let constitution = await this.$axios.get(url)
        return constitution.data
      } catch (err) {
        throw err
      }
    },
    signConstitution() {
      this.$refs.Transaction.newTransaction([{
        contract: this.$configFile.network.tokenContract.name,
        action: 'memberreg',
        fields: {
          sender: this.getAccountName,
          agreedterms: this.md5_constitution
        }
      }], false)
    },

    async checkRegistered(){
        let memberRegistration = await this.$store.dispatch('api/getRegistered');
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
    }


  },

  mounted: function() {
    this.getConstitution();
  }

}
</script>
