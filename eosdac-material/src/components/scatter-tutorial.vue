<template>
  <div class="bg-dark q-pa-md">
    <div>
      <p class="text-white">{{ $t('scatter_tutorial.if_you_are_unable_to_choose_an_identity') }}</p>
      <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white text-center" group="tut" :label="$t('scatter_tutorial.import_account')">
        <p class="text-white">{{ $t('scatter_tutorial.make_sure_active_key') }}</p>
        <img src="statics/img/key-menu.png" style="max-width:250px;" />
      </q-collapsible>
      <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white text-center" group="tut" :label="$t('scatter_tutorial.import_account_into_identity')">
        <p class="text-white" v-html="$t('scatter_tutorial.import_identity_instructions')"></p>
        <img src="statics/img/identity-menu.png" style="max-width:250px;" />
        <img src="statics/img/select-acc.png" style="max-width:250px;" />
      </q-collapsible>
    </div>
    <div>
      <br />
      <p class="text-white">{{ $t('scatter_tutorial.unable_to_connect') }}</p>
      <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white text-center" group="tut" :label="$t('scatter_tutorial.permissions')">
        <img src="statics/img/permissions-menu.png" style="max-width:250px;" />
      </q-collapsible>
      <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white text-center" group="tut" :label="$t('scatter_tutorial.select_domain')">
        <img src="statics/img/select-domain.png" style="max-width:250px;" />
      </q-collapsible>
      <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white text-center" group="tut" :label="$t('scatter_tutorial.revoke_identity')">
        <img src="statics/img/revoke_identity.png" style="max-width:250px;" /><br />
        <img src="statics/img/revoke_identity_confirmed.png" style="max-width:250px;" />
      </q-collapsible>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScatterTutorial',
  data () {
    return {}
  }
}
</script>

<style>
.tutstepper .q-stepper-header {
  display:none;
}
</style>
