<template>
<q-page class="text-white q-pa-md">


<div class="row gutter-md reverse-wrap">
  <!-- first column  -->
  <div class="col-xs-12 col-xl-8" >
    
      <div class="row justify-center bg-dark2 shadow-5 round-borders">
        <div class="col-lg-12 col-xl-auto ">
          <div class="bg-dark2 q-pa-md round-borders">
            <q-toggle class="float-right" color="p-light" v-model="white_constitution" left-label :label="$t('constitution.switch_contrast')" /></div>
          <div v-if="!isloading" class="q-pt-md   bg-dark2">
            <div v-bind:class="{ overwrite: !white_constitution }" class="markdown-body" v-html="constitution"></div>
          </div>
        </div>
      </div>
   
  </div>

  <!-- second column -->
  <div class="col-xs-12 col-xl-4" >
    <div>
      <div id="registerbox" class="bg-dark2 q-pa-md round-borders shadow-5" >
        <div class="q-mb-sm"><span class="text-dimwhite">{{ $t('default.constitution') }}: </span><span>V{{latestMemberTerms.version}}</span></div>
        <div class="q-mb-sm" style="overflow:hidden; white-space: nowrap;" ><span class="text-dimwhite">{{ $t('constitution.direct_link') }}: </span><span ><a  target="_blank" :href="latestMemberTerms.terms">{{latestMemberTerms.terms}}</a></span></div>
        <div class="q-mb-sm">
          <q-icon :title="$t('constitution.verified_message')" name="icon-ui-6" color="positive" class="q-mr-xs" style="margin-top:-8px"/>
          <span class="text-dimwhite">{{ $t('constitution.hash') }}: </span>
          <span>{{latestMemberTerms.hash}}</span>
        </div>
        <div class="row items-center justify-end" style="height:30px">
          <div v-if="getAccountName">
            <q-btn v-if="!getRegistered"  @click="signConstitution()"  color="primary" label="register" />
            <div  v-if="getRegistered" >{{ $t('constitution.signed_message') }}</div>
          </div>
        </div>
          <div v-if="!getAccountName">
            <div>{{ $t('constitution.please_login_to_sign') }}</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</div><!-- end row -->


  <q-scroll-observable @scroll="userHasScrolled" />
  <Transaction ref="Transaction" v-on:done="checkRegistered" />
  <LoadingSpinner :visible="isloading" :text="$t('constitution.loading_constitution')" />
</q-page>
</template>

<style lang="stylus">
@import '~variables'

#registerbox{
  position:relative;
  transition: all 1s ease 0s;
  top: 0;
}
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
        let constitution = await this.$axios.get(url);
        // console.log(constitution)
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
    },
    userHasScrolled(scroll){
      const votebox = document.getElementById('registerbox');
      if(scroll.position < 40 || window.innerWidth < 1199){
        votebox.style.top = '0px';
        return false;
      }
      // console.log(`votebox: ${offset(votebox).top} scroll: ${scroll.position}`);
      votebox.style.top = (scroll.position)+'px';
    }


  },

  mounted: function() {
    this.getConstitution();
  }

}
</script>
