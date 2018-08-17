<template>
<q-layout view="hHh Lpr lFf">
  <q-layout-header class="no-shadow">
    <q-toolbar color="dark2">
      <q-toolbar-title class="text-white q-pl-none">
        <q-icon style="font-size:35px;" name="icon-dac-balance" />
        <span class="q-ml-md q-mt-sm text-weight-thin vertical-middle" style="font-size:23px;">eos<b>DAC</b> {{ $t('default.member_client')}}</span>
        <q-btn size="lg" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" :aria-label="$t('menu')">
          <q-icon v-if="leftDrawerOpen" name="clear" />
          <q-icon v-else name="menu" />
        </q-btn>
      </q-toolbar-title>
      <div v-if="getImported">
        <MenuDropdown class="no-pointer-events" v-if="getAccountName && getRegistered" iconColor="white" :label="$t('default.member_status')" :statusLabel="1" :sublabel="$t('default.registered')" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName && !getRegistered" iconColor="white" :label="$t('default.member_status')" :statusLabel="2" :sublabel="$t('default.not_registered')" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" :label="$t('default.your_token_balance', { tokenName: tokenName })" :sublabel="String(getTokenBalance)" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" :label="$t('default.your_token_balance', { tokenName: mainCurrencyName })" :sublabel="String(getMainCurrencyBalance)" icon="icon-type-2" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" :label="$t('default.account_name')" :sublabel="getAccountName" icon="icon-topmenu-2" />
        <MenuDropdown v-if="getAccountName" iconColor="positive" :label="$t('default.status')" :sublabel="$t('default.logged_in')" icon="icon-topmenu-1" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="lockScatter()" dark>
              <q-item-side>
                <q-item-tile icon="icon-topmenu-4">
                </q-item-tile>
                {{ $t('default.log_out') }}
              </q-item-side>
            </q-item>
          </q-list>
        </MenuDropdown>
        <MenuDropdown v-else iconColor="white" :label="$t('default.status')" :sublabel="$t('default.logged_out')" icon="icon-topmenu-4" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="unlockAccount()" dark>
              <q-item-side>
                <q-item-tile color="positive" icon="icon-topmenu-1">
                </q-item-tile>
                {{ $t('default.log_in') }}
              </q-item-side>
            </q-item>
          </q-list>
        </MenuDropdown>
      </div>
    </q-toolbar>
  </q-layout-header>
  <q-layout-drawer v-model="leftDrawerOpen" content-class="bg-dark2">
    <q-list v-if="getAccountName" no-border link inset-delimiter dark>
      <!--<q-item to="/dashboard">
        <q-item-side icon="icon-menu-1" />
        <q-item-main label="Dashboard" sublabel="" />
      </q-item>-->
      <q-item to="/wallet">
        <q-item-side icon="icon-menu-6" />
        <q-item-main :label="$t('default.wallet')" sublabel="" />
      </q-item>
      <q-item @click.native="openURL($configFile.api.tokenExplorerUrl)" >
        <q-item-side icon="icon-menu-4" />
        <q-item-main :label="$t('default.token_explorer')" sublabel="" />
        <q-item-side right icon="icon-type-12" />
      </q-item>
      <q-item to="/settings">
        <q-item-side icon="icon-topmenu-6" />
        <q-item-main :label="$t('default.settings')" sublabel="" />
      </q-item>
      <q-item to="/constitution">
        <q-item-side icon="icon-register-3" />
        <q-item-main :label="$t('default.constitution')" sublabel="" />
      </q-item>
      <q-item to="/profile">
        <q-item-side icon="icon-topmenu-6" />
        <q-item-main :label="$t('default.profile')" sublabel="" />
      </q-item>
      <q-item to="/custodians">
        <q-item-side icon="icon-ui-3" />
        <q-item-main :label="$t('default.custodians')" sublabel="" />
      </q-item>
      <q-item to="/workerproposals">
        <q-item-side icon="icon-register-3" />
        <q-item-main :label="$t('default.worker_proposals')" sublabel="" />
      </q-item>
    </q-list>
  </q-layout-drawer>
  <q-page-container>
    <!--<Register ref="Register" />-->
    <router-view v-if="getAccountName" />
    <h4 class="text-white q-ma-md" v-else>{{ $t('default.logged_out') }}</h4>
    <!--<Initialize ref="Initialize" />-->
    <Notifier :drawer="leftDrawerOpen" />
    <q-alert v-if="!getRegistered && getAccountName" class="fixed-bottom z-top" style="margin-bttom:80px;" v-bind:class="{ 'drawer-margin': leftDrawerOpen }" color="blue" text-color="white">
      <div class="row">
        <div class="col-xs-1">
          <q-icon flat size="30px" class="float-left on-left q-ma-sm" name="icon-register-3"></q-icon>
        </div>
        <div class="col-xs-9">
          <div class="q-title">{{ $t('default.sign_the_constitution') }}</div>
          {{ $t('default.you_have_not_yet_registered') }}
          <q-btn @click="$refs.Multi.init('sign')" text-color="blue" color="white">{{ $t('default.sign_the_constitution') }}</q-btn>
        </div>
      </div>
    </q-alert>
  </q-page-container>
  <MultiModal ref="Multi" />
</q-layout>
</template>

<script>
import {
  openURL
} from 'quasar'
import {
  mapGetters
} from 'vuex'
import {
  Quasar
} from 'quasar'
import Initialize from 'components/initialize'
import Register from 'components/register'
import Notifier from 'components/notifier'
import MenuDropdown from 'components/menu-dropdown'
import MultiModal from 'components/multi-modal'
export default {
  name: 'LayoutDefault',
  components: {
    Initialize,
    Register,
    Notifier,
    MenuDropdown,
    MultiModal
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      tokenName: this.$configFile.network.tokenContract.token,
      mainCurrencyName: this.$configFile.network.mainCurrencyContract.token,
      lastQuery: 0,
      memberStatus: 0
    }
  },
  computed: {
    ...mapGetters({
      getImported: 'account/getImported',
      getAccountName: 'account/getAccountName',
      getUsesScatter: 'account/getUsesScatter',
      getRegistered: 'account/getRegistered',
      getScatter: 'api/getScatter',
      getCurrentEndpoint: 'api/getCurrentEndpoint',
      getAutolockInterval: 'account/getAutolockInterval',
      getConnectionInterval: 'api/getConnectionInterval',
      getLastUnlock: 'account/getLastUnlock',
      getTokenBalance: 'account/getTokenBalance',
      getAccount: 'account/getAccount',
      getMainCurrencyBalance: 'account/getMainCurrencyBalance'
    })
  },
  methods: {
    openURL,
    unlockAccount() {
      this.$refs.Multi.init('signin')
    },
    lockAccount() {
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    async lockScatter() {
      this.getScatter.forgetIdentity()
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    async queryApis() {
      let now = Date.now()
      if (this.getAccountName && this.$q.appVisible) {
        if (now > this.lastQuery + this.getConnectionInterval) {
          this.lastQuery = now
          this.$store.dispatch('api/getTokenContractBalance')
          this.$store.dispatch('api/getMainCurrencyBalance')
          this.$store.dispatch('api/updateAccountInfo')
        }
      }
    }
  },
  mounted() {
    if (!this.getImported) {
      this.$refs.Multi.init('register')
    }
    setInterval(this.queryApis, 1000)
  },
  created(){
    //language detection
    let lang = this.$q.i18n.getLocale()
    this.$i18n.locale = lang
    import ('quasar-framework/i18n/' + lang).then(lang => {
      if (lang) {
        this.$q.i18n.set(lang.default)
      }
    })
  }
}
</script>

<style>
</style>
