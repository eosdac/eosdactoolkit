import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

export default ({
  app,
  Vue,
  store,
  router
}) => {
  Vue.use(VueI18n)
  let la
  if (store.getters['account/getLanguage']) {
    la = store.getters['account/getLanguage']
  } else {
    la = 'en-us'
  }
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: la,
    fallbackLocale: 'en-us',
    messages: {
      'de': messages['de'],
      'en-gb': messages['en-gb'],
      'en-us': messages['en-us'],
      'es': messages['es'],
      'fr': messages['fr'],
      'it': messages['it'],
      'ja': messages['ja'],
      'ko': messages['ko'],
      'ru': messages['ru'],
      'zh-hans': messages['zh-hans'],
    }
  })
}
