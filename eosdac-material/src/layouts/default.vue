<template>
<q-layout view="hHh Lpr lFf">
  <q-layout-header class="no-shadow">
    <q-toolbar color="dark2">
      <q-toolbar-title class="text-white q-pl-none">
        <q-icon style="font-size:35px;" name="icon-menu-3" />
        <span class="q-ml-md q-mt-sm text-weight-thin vertical-middle" style="font-size:23px;">EOS<b>DAC</b> TOOLKIT</span>
        <q-btn size="lg" flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon v-if="leftDrawerOpen" name="clear" />
          <q-icon v-else name="menu" />
        </q-btn>
      </q-toolbar-title>
      <div v-if="getImported">
        <MenuDropdown v-if="getAccountName" iconColor="white" :label="'Your ' + tokenName + ' Blanace'" :sublabel="String(getTokenBalance)" icon="icon-dac-balance" />
        <MenuDropdown v-if="getAccountName" iconColor="white" :label="'Your ' + mainCurrencyName + ' Blanace'" :sublabel="String(getMainCurrencyBalance)" icon="icon-type-2" />
        <MenuDropdown v-if="getAccountName" iconColor="white" label="Account Name" :sublabel="getAccountName" icon="icon-topmenu-2" />
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
      <q-item to="/wallet">
        <q-item-side icon="icon-menu-6" />
        <q-item-main label="Wallet" sublabel="" />
      </q-item>
      <q-item to="/settings">
        <q-item-side icon="icon-topmenu-6" />
        <q-item-main label="Settings" sublabel="" />
      </q-item>
    </q-list>
  </q-layout-drawer>
  <q-page-container>
    <router-view v-if="getAccountName" v-show="getRegistered || $route.path === '/settings'" />
    <h4 class="text-white q-ma-md" v-else>Logged out</h4>
    <Register ref="Register"/>
    <Initialize ref="Initialize" />
    <Unlock ref="Unlock" />
    <Notifier :drawer="$q.platform.is.desktop" />
  </q-page-container>
</q-layout>
</template>

<script>
import {
  openURL
} from 'quasar'
import {
  mapGetters
} from 'vuex'
import Initialize from 'components/initialize'
import Unlock from 'components/unlock'
import Register from 'components/register'
import Notifier from 'components/notifier'
import MenuDropdown from 'components/menu-dropdown'
export default {
  name: 'LayoutDefault',
  components: {
    Initialize,
    Unlock,
    Register,
    Notifier,
    MenuDropdown
  },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      tokenName: this.$configFile.network.tokenContract.token,
      mainCurrencyName: this.$configFile.network.mainCurrencyContract.token,
      lastQuery: 0
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
      this.$refs.Unlock.open()
    },
    lockAccount() {
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    async lockScatter() {
      this.getScatter.forgetIdentity()
      this.$store.commit('account/LOCK_ACCOUNT')
    },
    loadScatter() {
      if (window.scatter) {
        console.log('scatter')
        this.$store.commit('api/SCATTER_AVAILABLE', window.scatter)
        window.scatter = null
      } else {
        document.addEventListener('scatterLoaded', scatterExtension => {
          if (window.scatter) {
            console.log('scatter')
            this.$store.commit('api/SCATTER_AVAILABLE', window.scatter)
            window.scatter = null
          }
        })
      }
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
    //check if registered
    if (!this.getScatter) {
      this.loadScatter()
    }
    if (!this.getImported) {
      this.$refs.Initialize.open()
    }
    //if (this.getAccountName) {
    //  console.log('Checking if user is registered')
    //  this.$refs.Register.checkRegistered()
    //}
    setInterval(this.queryApis, 1000)
    //setInterval(this.autolock, 1000)
  }
}
</script>

<style>
</style>
