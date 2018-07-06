<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="dark"
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

        <q-toolbar-title>
          Quasar App
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
        <q-btn @click="loginaction = true" color="white" text-color="primary">
          Unlock account
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      content-class="bg-dark"
    >
      <q-list
        no-border
        link
        inset-delimiter
        dark
      >
        <q-list-header>Essential Links</q-list-header>
        <q-item to="/test">
          <q-item-side icon="school" />
          <q-item-main label="test" sublabel="" />
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
      GETimported: 'account/GETimported'
    })
  },
  methods: {
    openURL
  },
  mounted () {
    if (!this.GETimported) {
      this.$refs.Initialize.open()
    }
  }
}
</script>

<style>
</style>
