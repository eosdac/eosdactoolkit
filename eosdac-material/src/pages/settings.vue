<template>
<q-page class="text-white q-pa-md">
  <h4 class="q-display-1 q-mt-none q-mb-md">Settings</h4>
  <q-tabs align="justify">
    <q-tab default slot="title" name="tab-1" label="API" />
    <!--<q-tab slot="title" name="tab-2" label="Account" />-->
    <q-tab-pane class="shadow-1 bg-dark2" name="tab-1">
      <q-collapsible separator dark icon="icon-register-1" label="API Endpoint">
      <NodeSelector />
    </q-collapsible>
    </q-tab-pane>
    <!--<q-tab-pane name="tab-2">

    </q-tab-pane>-->
  </q-tabs>

</q-page>
</template>

<script>
import NodeSelector from 'components/nodeselector'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Settings',
  components: {
    NodeSelector
  },
  computed: {
    ...mapGetters({
      getAccountName: 'account/getAccountName'
    })
  },
}
</script>

<style>
</style>
