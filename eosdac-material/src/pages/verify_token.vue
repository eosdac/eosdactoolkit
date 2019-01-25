<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mb-sm q-mt-none">Verify token</h4>
  <div class="q-pa-md bg-dark2 shadow-5 round-borders">

    <p class="text-dimwhite">You've been redirected to this page to verify a token.</p>
    <div class="row justify-start">
      <div style="display:inline-block;" class="bg-p-light q-pa-sm">token:</div> 
      <div  style="width:50%;max-width:360px;display:inline-block;"  class="bg-dark q-pa-sm"><div style="overflow:hidden">{{token}}</div></div>
      <div class="bg-dark q-pa-sm cursor-pointer" style="display:inline-block" @click="copyToClipboard"> <q-icon style="margin-top:-3px" name="file_copy" /> </div>
      <span v-if="copied_to_clipboard_msg !=null" class="q-pa-sm animate-fade q-caption text-dimwhite" >{{copied_to_clipboard_msg}}</span>
    </div>

    <div class="row justify-end q-mt-md">
      
      <q-btn label="validate" color="primary" @click="sign_message" />
    </div>
    
  </div>
  <input id="token_to_verify" style="position:absolute;left:-9999px" :value="token" />

  <Transaction ref="Transaction"  />
  <LoadingSpinner :visible="loading" :text="loadingText" />
</q-page>
</template>

<script>
import Transaction from 'components/transaction'
import LoadingSpinner from 'components/loading-spinner'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'verify_token',
  components: {
      Transaction,
      LoadingSpinner

  },
  data() {
    return {
      loading: false,
      loadingText: '',
      token: null,
      copied_to_clipboard_msg:null

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      // getAccountName: 'account/getAccountName'
      })

  },
  methods:{
    init(){
      this.token = this.$route.params.token;

    },

    sign_message: function(){
        let actions = [
        {
          contract: 'piecesnbitss', 
          action: 'pair',
          fields: {
            token: this.token, 
          }
        }

      ];
      this.$refs.Transaction.newTransaction(actions, false, false);   
    },

    copyToClipboard: function() {
      var copyText = document.getElementById("token_to_verify");
      copyText.select();
      document.execCommand("copy");
      this.copied_to_clipboard_msg = `Copied the token to your clipboard!`;
      setTimeout(()=>this.copied_to_clipboard_msg=null, 1500);
    }

  },
  mounted(){
    this.init();
  },
  watch: {
    '$route': function(){
                this.initProfile();
              },

  }

}
</script>

<style>

</style>
