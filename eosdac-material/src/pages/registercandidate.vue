<template>
<q-page class="text-white q-pa-md">
<h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("regcandidate.run_for_custodian") }}</h4>

<div class="row q-mt-md gutters-md bg-dark2 round-corners shadow-5" style="min-height:265px">
      <div class="col-md-8 col-sm-12 q-pa-md">
        dddddddd
      </div>
      <div class="col-md-4 col-sm-12 q-pa-md">
        <q-btn size="md" class="animate-pop" color="primary" @click="registerAsCandidate" :label="$t('regcandidate.register')" />
      </div>
</div>

<Transaction ref="Transaction"  />
</q-page>
</template>

<style lang="stylus">

</style>

<script>

import Transaction from 'components/transaction'

import {
  mapGetters
} from 'vuex'
export default {
  name: 'Settings',
  components: {
    Transaction
  },
  data (){
    return{

    }
  },
  mounted() {


  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered'
    })
  },
  methods:{
    registerAsCandidate() {
        this.$store.dispatch('api/registerCandidate', {
          scatter: true,
        })
    },

  }
}
</script>
