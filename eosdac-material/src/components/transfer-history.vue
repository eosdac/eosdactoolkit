<template>
  <div>
    <q-list v-if="!error" dark class="relative-position" style="min-height:250px;">
    <q-item>...</q-item>
    {{history}}
    <LoadingSpinner :visible="loading" :text="loadingText" />
  </q-list>
  <q-alert color="dark" v-else>{{errorText}}</q-alert>
  </div>

</template>

<script>
import LoadingSpinner from 'components/loading-spinner'
export default {
  name: 'TransferHistory',
  components: {
    LoadingSpinner
  },
  data () {
    return {
      loading: false,
      loadingText: '',
      error: false,
      errorText: '',
      history : []
    }
  },
  methods: {
    async getTransferHistory() {
      if (!this.loading) {
        this.loading = true
        try {
          let history = await this.$store.dispatch('api/getActionHistory')
          this.history = history
        } catch (err) {
          this.error = true
          if (err.status && err.status === 404) {
            this.errorText = 'Action history not available with current API endpoint.'
          } else {
            this.errorText = err
          }

        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style>
</style>
