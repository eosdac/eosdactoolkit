<template>
<q-page class="text-white q-pa-md">

<Transaction ref="Transaction" v-on:done="$refs.Register.checkRegistered(true)" />
<Register ref="Register" />

<h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("settings.settings") }}</h4>

<!-- api endpoints -->
<div class="shadow-5" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-register-1"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $tc('settings.API_endpoint') }}</span>
        <span class="q-ml-lg text-dimwhite" >{{ $t("settings.current_connection") }}:</span>
        <span v-if="getCurrentEndpoint.lastConnectionStatus" class="q-ml-md text-positive">{{getCurrentEndpoint.httpEndpoint}}</span>
        <span v-else class="q-ml-md text-negative">{{getCurrentEndpoint.httpEndpoint}}</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <NodeSelector />
  </q-collapsible>
</div>

<!-- member status -->
<div class="shadow-5 q-mt-md" style="background:#2F333D">
  <q-collapsible  label="First"  separator  header-class="bg-dark2"  collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-type-4"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $t("settings.member_status") }}</span>
        <span class="q-ml-lg text-dimwhite" >{{ $t("settings.current_status") }}:</span>
        <span v-if="getRegistered" class=" q-ml-md text-positive">{{ $t("settings.REGISTERED") }}</span>
        <span v-else class=" q-ml-md text-negative">{{ $t("settings.NOT_REGISTERED") }}</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <div class="row" style="min-height:140px">
      <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
        <p class="q-title" >{{ $t("settings.unregister_membership") }}</p>
        <p class="text-dimwhite q-body-1" style="min-height:30px">{{ $t("settings.click_below_to_unregister_membership") }}</p>
        <div class="q-mt-lg">
          <q-btn :disabled="!getRegistered" size="md" class="float-right" color="primary" @click="unRegisterMember" :label="$t('settings.unregister_membership')" />
        </div>
      </div>
      <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
        <p class="q-title">{{ $t('settings.register_as_member') }}</p>
        <p class="text-dimwhite q-body-1" style="min-height:30px">{{ $t('settings.click_register_now') }}</p>
        <div class="q-mt-lg">
          <q-btn size="md" :disabled="getRegistered" class="float-right" color="primary" @click="$refs.Multi.init('sign')" :label="$t('settings.register_now')" />
        </div>
      </div>
    </div>
  </q-collapsible>
</div>

<!-- language setting -->
<div class="shadow-5 q-mt-md" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-ui-10"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $t('settings.language_preference') }}</span>
        <span class="q-ml-lg text-dimwhite" >{{ $t("settings.current_language") }}:</span>
        <span v-if="getCurrentEndpoint.lastConnectionStatus" class="q-ml-md text-positive">{{ $i18n.locale }}</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <div class="q-pa-md">
      <LangSelector />
    </div>
  </q-collapsible>
</div>

<!-- Misc usersettings -->
<div class="shadow-5 q-mt-md" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-ui-10"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $t('settings.user_preference') }}</span>
        <span class="q-ml-lg text-dimwhite" >xxxxxxxxxxxx:</span>
        <span v-if="true" class="q-ml-md text-positive">xxxxxxxxxxxxxxxxx</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <div class="q-pa-md">
      <q-toggle  class="float-right" v-model="transactionpopup" left-label :label="$t('settings.transaction_popup')" />
      {{transactionpopup}}
    </div>
  </q-collapsible>
</div>

<MultiModal ref="Multi" />
</q-page>
</template>

<style lang="stylus">
.hack_height{
  height:50px !important;
}

</style>

<script>

import Transaction from 'components/transaction'
import Register from 'components/register'
import MultiModal from 'components/multi-modal'
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
    Transaction,
    Register,
    MultiModal

  },
  data (){
    return{
      transactionpopup: ''
    }
  },
  mounted() {
    this.transactionpopup = this.getTransactionPopup

  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getTransactionPopup: 'usersettings/getTransactionPopup'
    })
  },
  methods:{
    unRegisterMember() {
      this.$refs.Transaction.newTransaction(this.$configFile.network.tokenContract.name, 'memberunreg', {
        sender: this.getAccountName
      }, false)
    },

  },
  watch: {
    transactionpopup (bool) {
      this.$store.commit('usersettings/SET_TRANSACTIONPOPUP', bool)
    }
  }
}
</script>
