<template>
  <div class="bg-dark q-pa-md">
    <p class="text-white">If you are unable to choose a identity, follow the steps below.</p>
  <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white" group="tut" label="1. Import account">
    <p class="text-white">Make sure that you have your active key for your account imported into scatter.</p>
    <img src="statics/img/key-menu.png" style="max-width:250px;" />
  </q-collapsible>
  <q-collapsible :header-style="{fontWeight: 'bold', fontSize:'20px'}" class="text-white" group="tut" label="2. Import Account into Identity">
    <p class="text-white">Go to your Identities section.<br>On your Identity click on the pencil icon.<br>Inside your Identity, go to the "Account" section.<br>Now choose your imported account from the list.<br>Save your Identity with the Save button in the top right</p>
    <img src="statics/img/identity-menu.png" style="max-width:250px;" />
    <img src="statics/img/select-acc.png" style="max-width:250px;" />
  </q-collapsible>
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
