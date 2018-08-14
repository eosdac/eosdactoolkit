<template>
<q-layout view="hHh Lpr lFf">
  <q-layout-header class="no-shadow">
    <q-toolbar color="dark2">
      <q-toolbar-title class="text-white q-pl-none">
        <q-icon style="font-size:35px;" name="icon-dac-balance" />
        <span class="q-ml-md q-mt-sm text-weight-thin vertical-middle" style="font-size:23px;">EOS<b>DAC</b> Member Client</span>
        <q-btn size="lg" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon v-if="leftDrawerOpen" name="clear" />
          <q-icon v-else name="menu" />
        </q-btn>
      </q-toolbar-title>
      <div v-if="getImported">
        <MenuDropdown class="no-pointer-events" v-if="getAccountName && getRegistered" iconColor="white" label="Member status" :statusLabel="1" sublabel="Registered" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName && !getRegistered" iconColor="white" label="Member status" :statusLabel="2" sublabel="not registered" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" :label="'Your ' + tokenName + ' Blanace'" :sublabel="String(getTokenBalance)" icon="icon-dac-balance" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" :label="'Your ' + mainCurrencyName + ' Blanace'" :sublabel="String(getMainCurrencyBalance)" icon="icon-type-2" />
        <MenuDropdown class="no-pointer-events" v-if="getAccountName" iconColor="white" label="Account Name" :sublabel="getAccountName" icon="icon-topmenu-2" />
        <MenuDropdown v-if="getAccountName" iconColor="positive" label="Status" sublabel="Logged-In" icon="icon-topmenu-1" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="lockScatter()" dark>
              <q-item-side>
                <q-item-tile icon="icon-topmenu-4">
                </q-item-tile>
                Log Out
              </q-item-side>
            </q-item>
          </q-list>
        </MenuDropdown>
        <MenuDropdown v-else iconColor="white" label="Status" sublabel="Logged-Out" icon="icon-topmenu-4" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="unlockAccount()" dark>
              <q-item-side>
                <q-item-tile color="positive" icon="icon-topmenu-1">
                </q-item-tile>
                Log In
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
        <q-item-main label="Wallet" sublabel="" />
      </q-item>
      <q-item to="/explorer/ ">
        <q-item-side icon="icon-menu-4" />
        <q-item-main label="Explorer" sublabel="" />
      </q-item>
      <q-item to="/settings">
        <q-item-side icon="icon-topmenu-6" />
        <q-item-main label="Settings" sublabel="" />
      </q-item>
      <!--<q-item to="/custodians">
        <q-item-side icon="icon-ui-3" />
        <q-item-main label="Custodians" sublabel="" />
      </q-item>
      <q-item to="/workerproposals">
        <q-item-side icon="icon-register-3" />
        <q-item-main label="Worker Proposals" sublabel="" />
      </q-item>-->
    </q-list>
  </q-layout-drawer>
  <q-page-container>
    <!--<Register ref="Register" />-->
    <router-view v-if="getAccountName" />
    <h4 class="text-white q-ma-md" v-else>Logged out</h4>
    <!--<Initialize ref="Initialize" />-->
    <!--<Unlock ref="Unlock" />-->
    <Notifier :drawer="$q.platform.is.desktop" />
    <q-alert v-if="!getRegistered && getAccountName" class="fixed-bottom z-max" v-bind:class="{ 'drawer-margin': leftDrawerOpen }" color="blue" text-color="white">
      <div class="row">
        <div class="col-xs-1">
          <q-icon flat size="30px" class="float-left on-left q-ma-sm" name="icon-register-3"></q-icon>
        </div>
        <div class="col-xs-9">
          <div class="q-title">Sign the Constitution</div>
          You have not been registered as a Member yet. Please sign the constitution to use the Member Client.
          <q-btn @click="$refs.Multi.init('sign')" text-color="blue" color="white">Sign the Constitution</q-btn>
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
import Unlock from 'components/unlock'
import Register from 'components/register'
import Notifier from 'components/notifier'
import MenuDropdown from 'components/menu-dropdown'
import MultiModal from 'components/multi-modal'
export default {
  name: 'LayoutDefault',
  components: {
    Initialize,
    Unlock,
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
      getUnlocked: 'account/getUnlocked',
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
      //this.$refs.Unlock.open()
      this.$refs.Multi.init('signin')
    },
    lockAccount() {
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    async lockScatter() {
      this.getScatter.forgetIdentity()
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    /*autolock() {
      if (this.getLastUnlock && this.getUnlocked && this.lastQuery) {
        if (this.getAutolockInterval * 10 + this.lastQuery < Date.now() / 1000)) {
          if (this.getUsesScatter) {
            this.lockScatter()
          } else {
            this.lockAccount()
          }
        }
      }
    },*/
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
      //this.$refs.Initialize.open()
      this.$refs.Multi.init('register')
    }
    setInterval(this.queryApis, 1000)
    //setInterval(this.autolock, 1000)
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
