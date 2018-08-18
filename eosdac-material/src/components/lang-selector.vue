<template>
  <q-field :label="$t('lang_selector.choose_your_language')" label-width="12" dark>
  <q-select
  dark
    :options="[
      { label: 'Chinese (Simplified)', value: 'zh-hans' },
      { label: 'English (US)',         value: 'en-us' },
      { label: 'English (GB)',         value: 'en-gb' },
      { label: 'French',               value: 'fr' },
      { label: 'German',               value: 'de' },
      { label: 'Italian',              value: 'it' },
      { label: 'Japanese',             value: 'ja' },
      { label: 'Korean',               value: 'ko' },
      { label: 'Russian',              value: 'ru' },
      { label: 'Spanish',              value: 'es' },
    ]"
    v-model="lang"
  />
</q-field>
</template>

<script>
export default {
  name: 'LangSelector',
  data () {
    return {
      lang: this.$q.i18n.lang
    }
  },
  watch: {
    lang (lang) {
      // dynamic import, so loading on demand only
      import('quasar-framework/i18n/' + lang).then(lang => {
        this.$q.i18n.set(lang.default)
      })
      this.$i18n.locale = lang
    }
  }
}
</script>

<style>
</style>
