<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header class="no-shadow">
      <q-toolbar
        color="bg-dark2"
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
      <q-btn size="lg" icon="account_circle" flat :label="getAccountName">
</q-btn>
        <q-btn-dropdown size="lg" icon="lock" flat label="Button">
  <q-list link>
    <q-item>
      <q-item-main>
        <q-item-tile icon="lock" label>lock</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</q-btn-dropdown>

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
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'
import { mapGetters } from 'vuex'
import Initialize from 'components/initialize'

export default {
  name: 'LayoutDefault',
  components: {
    Initialize
  },
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapGetters({
      getImported: 'account/getImported',
      getAccountName: 'account/getAccountName'
    })
  },
  methods: {
    openURL,
    closeInitModal () {
      this.$refs.Initialize.closeInit()
    }
  },
  mounted () {
    if (!this.getImported) {
      this.$refs.Initialize.openInit()
    }
    document.addEventListener('scatterLoaded', scatterExtension => {
      if (window.scatter) {
        this.$store.commit('api/SCATTER_AVAILABLE', window.scatter)
        window.scatter = null
      }
    })
  }
}
</script>

<style>
</style>
