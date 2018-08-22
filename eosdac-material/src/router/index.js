import Vue from 'vue'
import VueRouter from 'vue-router'
import Quasar from 'quasar'
console.log(Quasar.i18n.getLocale())

import routes from './routes'

Vue.use(VueRouter)

const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: '/' instead of ''
   */

  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

// use beforeEach route guard to set the language
// Router.beforeEach((to, from, next) => {

//   // use the language from the routing param or default language
//   let language = to.params.lang;
//   console.log(language)
//   if (!language || language === undefined) {
//     language = 'fr';//dfault
//   }
//   // set the current language for vuex-i18n. note that translation data
//   // for the language might need to be loaded first
//   import ('quasar-framework/i18n/' + language).then(lang => {
//     console.log(lang)
//     if (lang) {
//       Quasar.i18n.set(lang.default);
//       // Quasar.i18n.locale = language
//     }
//   })
  
//   next();
  
// });

export default Router
