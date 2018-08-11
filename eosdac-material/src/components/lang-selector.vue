<template>
  <q-select
  dark
    stack-label="I18n"
    :options="[
      { label: 'English (US)',         value: 'en-us' },
      { label: 'English (UK)',         value: 'en-uk' },
      { label: 'Romanian',             value: 'ro' },
      { label: 'Chinese (Simplified)', value: 'zh-hans' },
      { label: 'Italian',              value: 'it' },
      { label: 'Spanish',              value: 'es' },
      { label: 'French',               value: 'fr' },
      { label: 'German',               value: 'de' },
      { label: 'Russian',              value: 'ru' }
    ]"
    v-model="lang"
  />
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
