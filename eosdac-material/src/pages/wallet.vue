<template>
  <q-page padding>
    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <q-card dark flat class="q-mb-sm">
          <q-card-title class="text-primary">
          </q-card-title>
          <q-card-main>
            {{queryText}}
            <q-field :error="error" label="Query account" :error-label="errorText" :label-width="12">
              <q-input dark placeholder="someaccount" type="text" v-model="account" />
            </q-field>
          </q-card-main>
          <q-card-actions>
            <q-btn color="primary" @click="lookupBalance()">Lookup Balance</q-btn>
          </q-card-actions>
          <q-list class="bg-dark2" dark>
            <q-item v-for="(balance, index) in balances" :key="index" dark>
              {{balance}}
          </q-item>
        </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
   name: 'Wallet',
   data () {
     return {
       error: false,
       errorText: '',
       account: '',
       balances: [],
       queryText: ''
     }
   },
   methods: {
     lookupBalance () {
       this.$store.dispatch('api/getTokenContractBalance', {account: this.account}).then((res) => {
         if (!res.rows.length) {
           this.queryText = 'Could not find account'
         } else {
           this.queryText = ''
           this.balances = res.rows
         }
         console.log(res)
       }, (err) => {
         console.log(err)
       })
     }
   }
}
</script>

<style>
</style>
