<template>
<q-page class="text-white q-pa-md">
 

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
      loadingText: ''

    }
  },
  computed: {
    ...mapGetters({
      // getactiveCustodians: 'api/getActiveCustodians',
      // getAccountName: 'account/getAccountName'
      })

  },
  methods:{

  },
  mounted(){

  }

}
</script>

<style>

</style>
