<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header class="no-shadow">
      <q-toolbar
        color="dark2"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>

        <q-toolbar-title class="text-primary text-white">
        <div class="q-headline">
          <img alt="EOSDAC" style="max-height:30px; color: white; margin-bottom:-5px; margin-right:-5px;" src="~assets/eosdac_logo.png"> eosDAC
        </div>
      </q-toolbar-title>
        <div v-if="getUsesScatter">
          <q-btn size="lg" icon="lock" flat :label="getAccountName" />
        </div>
        <div v-else >
          <q-btn-dropdown size="lg" icon="lock" flat :label="getAccountName">
            <q-list class="bg-dark2" dark link>
              <q-item @click.native="lockAccount()" v-if="getUnlocked" dark>
                <q-item-side>
                <q-item-tile icon="lock">
                </q-item-tile>
                Lock
              </q-item-side>
            </q-item>
            <q-item @click.native="unlockAccount()" v-else dark>
              <q-item-side>
              <q-item-tile icon="lock">
              </q-item-tile>
              Unlock
            </q-item-side>
          </q-item>
            </q-list>
  </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-dark2"
    >
      <q-list
        no-border
        link
        inset-delimiter
        dark
      >
        <q-item to="/wallet">
          <q-item-side icon="school" />
          <q-item-main label="Wallet" sublabel="" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
      <Initialize ref="Initialize" />
      <Unlock ref="Unlock" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'
import Initialize from 'components/initialize'
import Unlock from 'components/unlock'

export default {
  name: 'LayoutDefault',
  components: {
    Initialize,
    Unlock
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapGetters({
      getImported: 'account/getImported',
      getAccountName: 'account/getAccountName',
      getUnlocked: 'account/getUnlocked',
      getUsesScatter: 'account/getUsesScatter'
    })
  },
  methods: {
    openURL,
    closeInitModal () {
      this.$refs.Initialize.closeInit()
    },
    unlockAccount () {
      this.$refs.Unlock.openUnlock()
    },
    lockAccount() {
      this.$store.commit('account/LOCK_ACCOUNT')
    }
  },
  mounted () {
    if (!this.getImported) {
      this.$refs.Initialize.openInit()
    }
    document.addEventListener('scatterLoaded', scatterExtension => {
      if (window.scatter) {
        this.$store.commit('api/SCATTER_AVAILABLE', window.scatter)
        this.$scatter = window.scatter
        window.scatter = null
      }
    })
  }
}
</script>

<style>
</style>
