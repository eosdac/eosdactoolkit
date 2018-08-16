<template>
<q-page class="text-white q-pa-md">

  <h4 class="q-display-1 q-mt-none q-mb-md">Settings</h4>

<div class="shadow-5" style="background:#2F333D">
  <q-collapsible  label="First" separator header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-register-1"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>API Endpoints</span>
        <span class="q-ml-lg text-dimwhite" >Current Connection:</span>
        <span class=" q-ml-md text-positive">{{current_connection}}</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <NodeSelector />
  </q-collapsible>
</div>

<div class="shadow-5 q-mt-md" style="background:#2F333D">
  <q-collapsible  label="First"  separator  header-class="bg-dark2" collapse-icon="icon-ui-11">
    <template slot="header" >
      <q-item-side left >
        <q-icon name="icon-type-4"  color="white"  size="24px" />
      </q-item-side>
      <q-item-main >
        <span>Member Status</span>
        <span class="q-ml-lg text-dimwhite" >Current Status:</span>
        <span v-if="current_member_status" class=" q-ml-md text-positive">REGISTERED</span>
        <span v-else class=" q-ml-md text-negative">NOT REGISTERED</span>
      </q-item-main>
      <span class="hack_height"></span>
    </template>
    <NodeSelector />
  </q-collapsible>
</div>

<br><br>










  <q-tabs align="justify">
    <q-tab default slot="title" name="tab-1" label="API" />
    <!--<q-tab slot="title" name="tab-2" label="Language" />-->
    <!--<q-tab slot="title" name="tab-2" label="Account" />-->
    <q-tab-pane class="shadow-1 bg-dark2" name="tab-1">
      <q-collapsible separator dark icon="icon-register-1" collapse-icon="icon-ui-11" label="API Endpoint">
      <NodeSelector />
    </q-collapsible>
    </q-tab-pane>
    <q-tab-pane class="shadow-1 bg-dark2" name="tab-2">
    <LangSelector/>
    </q-tab-pane>
    <!--<q-tab-pane name="tab-2">

    </q-tab-pane>-->
  </q-tabs>

</q-page>
</template>
<style lang="stylus">

.hack_height{
  height:50px !important;
}

</style>

<script>
import NodeSelector from 'components/nodeselector'
import LangSelector from 'components/lang-selector'
import {
  mapGetters
} from 'vuex'
export default {
  name: 'Settings',
  components: {
    NodeSelector,
    LangSelector
  },
  data (){
    return{
        current_connection: 'test',
        current_member_status : true
    }
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
