<template>
<q-page class="text-white q-pa-md">

  <h4 class="q-display-1 q-mt-none q-mb-md">Settings</h4>

<div class="shadow-5" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-register-1"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>API Endpoints</span>
        <span class="q-ml-lg text-dimwhite" >Current Connection:</span>
        <span class=" q-ml-md text-positive">{{getCurrentEndpoint.httpEndpoint}}</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <NodeSelector />
  </q-collapsible>
</div>

<Transaction ref="Transaction" v-on:done="checkRegistered(true)" />

<div class="shadow-5 q-mt-md" style="background:#2F333D">
  <q-collapsible  label="First"  separator  header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-type-4"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>Member Status</span>
        <span class="q-ml-lg text-dimwhite" >Current Status:</span>
        <span v-if="getRegistered" class=" q-ml-md text-positive">REGISTERED</span>
        <span v-else class=" q-ml-md text-negative">NOT REGISTERED</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <div class="row" style="min-height:140px">
        <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
          <p class="q-title" >Unregister Membership</p>
          <p class="text-dimwhite q-body-1" style="min-height:30px">Click the button below to unregister your eosDAC membership</p>
          <div class="q-mt-lg">
              <q-btn size="sm" class="float-right" color="primary" @click="unRegisterMember" label="Unregister Membership" />
          </div>
        </div>
        <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
          <p class="q-title">Register as Member</p>
          <p class="text-dimwhite q-body-1" style="min-height:30px">Click "Register Now" to become a member of eosDAC.</p>
          <div class="q-mt-lg">
            <q-btn size="sm" class="float-right" color="primary" @click="" label="Register Now" />
          </div>
        </div>
    </div>
  </q-collapsible>
</div>


</q-page>
</template>
<style lang="stylus">

.hack_height{
  height:50px !important;
}

</style>

<script>
import Transaction from 'components/transaction'
import NodeSelector from 'components/nodeselector'
import LangSelector from 'components/lang-selector'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Settings',
  components: {
    NodeSelector,
    LangSelector,
    Transaction
  },
  data (){
    return{
        current_connection: 'test',
        // current_member_status : true
    }
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getCurrentEndpoint: 'api/getCurrentEndpoint'
    })
  },
  methods:{
    unRegisterMember() {
      this.$refs.Transaction.newTransaction('memberunreg', {
        sender: this.getAccountName
      }, false)
    },

  }
}
</script>

<style>
</style>
