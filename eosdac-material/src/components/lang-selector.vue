<template>
  <q-field :label="$t('lang_selector.choose_your_language')" label-width="12" dark>
  <q-select
  dark
    :options="[
      { label: $t('lang_selector.languages.chinese') + ' - 中文',    value: 'zh-hans' },
      { label: $t('lang_selector.languages.english_us') + ' - English (US)', value: 'en-us' },
      { label: $t('lang_selector.languages.english_gb') + ' - English (GB)', value: 'en-gb' },
      { label: $t('lang_selector.languages.french') + ' - Français',     value: 'fr' },
      { label: $t('lang_selector.languages.german') + ' - Deutsche',     value: 'de' },
      { label: $t('lang_selector.languages.italian') + ' - Italiano',    value: 'it' },
      { label: $t('lang_selector.languages.japanese') + ' - 日本語',   value: 'ja' },
      { label: $t('lang_selector.languages.korean') + ' - 한국어',     value: 'ko' },
      { label: $t('lang_selector.languages.russian') + ' - Pусский',    value: 'ru' },
      { label: $t('lang_selector.languages.spanish') + ' - Español',    value: 'es' },
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
