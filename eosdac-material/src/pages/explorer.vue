<template>
  <q-page>
    <iframe v-if="$route.params.id.length > 10" style="position: absolute; height: 100%; border: none;" class="fit full-height" :src="this.$configFile.api.tokenExplorerUrl + '/transaction/' + $route.params.id"></iframe>
    <iframe v-else style="position: absolute; height: 100%; border: none;" class="fit full-height" :src="this.$configFile.api.tokenExplorerUrl"></iframe>
  </q-page>
</template>

<script>
export default {
  name: 'Explorer'
}
</script>

<style>
</style>
