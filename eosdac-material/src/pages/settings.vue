<template>
<q-page class="text-white q-pa-md">

<Transaction ref="Transaction" v-on:done="checkRegistered" />

<h4 class="q-display-1 q-mt-none q-mb-md">{{ $t("settings.settings") }}</h4>

<!-- api endpoints -->
<div class="shadow-5" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-register-1"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $t('settings.API_endpoint') }}</span>
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
        <q-icon v-if="getRegistered" name="icon-role-3" color="white"  size="24px" />
        <q-icon v-else name="icon-role-1" color="white"  size="24px" />
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
          <q-btn size="md" :disabled="getRegistered" class="float-right" color="primary" to="/constitution" :label="$t('settings.register_now')" />
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
        <q-icon name="icon-ui-18"  color="white"  size="24px" />
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
        <q-icon name="icon-ui-20"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>{{ $t('settings.user_preference') }}</span>
        <span class="q-ml-lg text-dimwhite" ></span>
        <span v-if="true" class="q-ml-md text-positive"></span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>

    <div class="row q-mb-lg">
      <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
        <div>{{$t('settings.transaction_popup_desc')}} <span v-if="transactionpopup" class="text-positive">{{ $t('settings.on') }}</span><span v-if="!transactionpopup"  class="text-negative">{{ $t('settings.off') }}</span></div>
        <div class="q-mt-lg">
          <q-toggle  class="float-left" v-model="transactionpopup" color="p-light" left-label :label="$t('settings.transaction_popup_label')" />
          <!-- <q-toggle  class="float-left" v-model="consolemessage" color="p-light" left-label :label="$t('settings.console_message_label')" /> -->
        </div>
      </div>
      <div class="col-sm-12 col-lg-4 q-pa-md relative-position" >
        <div style="full-width">
          <div  class="q-mb-xs">Set a Delay on transactions.</div>
          <div class="row items-end">
            <div class="col" >
              <q-input type="number" dark v-model="transactiondelay" />
            </div>
            <div class="col" >
              <div class="text-dimwhite q-caption on-right">seconds</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>

  </q-collapsible>
  
</div>
<div class="q-mt-lg q-pb-md">
  <span class="float-right text-dimwhite q-title text-weight-thin">
    <span class="uppercase">{{$configFile.network.name}}: </span>
    <span>TestDAC v{{app_version}}</span>
  </span>
</div>

</q-page>
</template>

<style lang="stylus">
.hack_height{
  height:50px !important;
}

</style>

<script>
import packageJson from '../../package.json';
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
    Transaction,
 

  },
  data (){
    return{
      transactionpopup: '',
      consolemessage: '',
      transactiondelay: 0,
      app_version: packageJson.version
    }
  },
  mounted() {
    this.transactionpopup = this.getTransactionPopup
    this.consolemessage = this.getConsoleMessage
    this.transactiondelay = this.getTransactionDelay

  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName',
      getRegistered: 'account/getRegistered',
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getTransactionPopup: 'usersettings/getTransactionPopup',
      getConsoleMessage: 'usersettings/getConsoleMessage',
      getTransactionDelay: 'usersettings/getTransactionDelay'
    })
  },
  methods:{
    unRegisterMember() {
      this.$refs.Transaction.newTransaction([{
        contract: this.$configFile.network.tokenContract.name,
        action: 'memberunreg',
        fields: {
          sender: this.getAccountName
        }
      }], false)  
    },

    async checkRegistered(){
        let memberRegistration = await this.$store.dispatch('api/getRegistered');
        let latestMemberTerms = await this.$store.dispatch('api/getMemberTerms');
    }

  },
  watch: {
    transactionpopup (bool) {
      this.$store.commit('usersettings/SET_TRANSACTIONPOPUP', bool)
    },
    consolemessage (bool) {
      this.$store.commit('usersettings/SET_CONSOLEMESSAGE', bool)
    },
    transactiondelay (delay) {
      
      this.$store.commit('usersettings/SET_TRANSACTIONDELAY', delay)
    }
  }
}
</script>
