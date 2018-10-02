import VueI18n from 'vue-i18n'
import messages from 'src/i18n'

export default ({
  app,
  Vue,
  store,
  router
}) => {
  Vue.use(VueI18n)
  let lang
  if (store.getters['usersettings/getLanguage']) {
    lang = store.getters['usersettings/getLanguage']
  } else {
    if (typeof(messages[browserLocale()]) === 'undefined') {
      lang = 'en-us'
    } else {
      lang = browserLocale()
    }
  }
  store.commit('usersettings/SET_LANGUAGE', lang)
  app.i18n = new VueI18n({
    silentTranslationWarn: false,
    locale: lang,
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
      'vi': messages['vi'],
      'zh-hans': messages['zh-hans'],
    }
  })

}

function browserLocale() {
  let lang
  if (navigator.languages && navigator.languages.length) {
    // latest versions of Chrome and Firefox set this correctly
    lang = navigator.languages[0]
  } else if (navigator.userLanguage) {
    // IE only
    lang = navigator.userLanguage
  } else {
    // latest versions of Chrome, Firefox, and Safari set this correctly
    lang = navigator.language
  }
  return lang.toLowerCase()
}
