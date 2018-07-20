<template>
<q-layout view="hHh Lpr lFf">
  <q-layout-header class="no-shadow">
    <q-toolbar color="dark2">
      <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title class="text-white">
        <p class="text-weight-thin">
          <q-icon style="font-size:40px;" name="icon-logo-eosdac" /> EOS
          <b>DAC</b> TOOLKIT</p>
      </q-toolbar-title>
      <div v-if="getImported">
        <MenuDropdown v-if="getUnlocked" iconColor="positive" label="Status" sublabel="Logged-In" icon="icon-lock-unlocked" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="lockAccount()" dark>
              <q-item-side>
                <q-item-tile icon="icon-lock-locked">
                </q-item-tile>
                Log Out
              </q-item-side>
            </q-item>
          </q-list>
        </MenuDropdown>
        <MenuDropdown v-else iconColor="white" label="Status" sublabel="Logged-Out" icon="icon-lock-locked" :iconRight="true">
          <q-list class="bg-dark2" dark link>
            <q-item @click.native="unlockAccount()" dark>
              <q-item-side>
                <q-item-tile color="positive" icon="icon-lock-unlocked">
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
    <q-list no-border link inset-delimiter dark>
      <q-item to="/wallet">
        <q-item-side icon="icon-wallet" />
        <q-item-main label="Wallet" sublabel="" />
      </q-item>
    </q-list>
  </q-layout-drawer>

  <q-page-container>
    <router-view />
    <Initialize ref="Initialize" v-on:initDone="refs.Register.open()" />
    <Unlock ref="Unlock" />
    <Notifier :drawer="leftDrawerOpen" />
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
      leftDrawerOpen: this.$q.platform.is.desktop
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
      getAutolockInterval: 'account/getAutolockInterval'
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
    checkScatter() {
      if (this.getUsesScatter) {
        this.getScatter.getIdentity().then(identity => {
          this.$store.commit('account/UNLOCK_ACCOUNT_SCATTER')
        }).catch(error => {
          this.$store.commit('account/LOCK_ACCOUNT')
        })
      }

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

    }
    /*,
        autolock () {
          if (this.getAutolockInterval && this.getAutolockInterval + this.lastUnlock <= Math.floor(Date.now() / 1000)) {
            this.lockAccount()
          }
        }*/
    /*async queryApi() {
      try {
        let query = await this.$store.dispatch('api/pingCurrentEndpoint', this.getCurrentEndpoint)
      }
    }*/
  },
  mounted() {
    this.loadScatter()
    if (this.getCurrentEndpoint) {
      this.$store.dispatch('api/pingCurrentEndpoint', {
        url: this.getCurrentEndpoint.httpEndpoint
      }).then(() => {}, (err) => {
        //open settings
      })
      this.$store.dispatch('api/getRegistered').then((res) => {
        let findAccount = res.rows.find(findAccount => {
          return findAccount.sender === this.getAccountName
        })
        if (findAccount) {
          this.$store.commit('account/ADD_REGISTRATION', findAccount.agreedterms)
        }
      })
    }

    if (!this.getImported) {
      this.$refs.Initialize.open()
    }
    //setInterval(this.checkScatter, 1000)

  }
}
</script>

<style>
</style>
