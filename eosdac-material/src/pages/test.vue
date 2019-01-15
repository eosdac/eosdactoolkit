<template>
<q-page class="text-white q-pa-md">
  <div>token: {{token}}</div>
  <q-btn label="validate" @click="sign_message" />

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
  name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  components: {
      Transaction,
      LoadingSpinner

  },
  data() {
    return {
      loading: false,
      loadingText: '',
      token: null

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
      this.$refs.Transaction.newTransaction(actions, false, false, 'e_unapproval');   
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
