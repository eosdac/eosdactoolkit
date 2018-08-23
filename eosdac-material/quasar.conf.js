// Configuration for your app

module.exports = function(ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'configloader',
      'eosdac-iconfont',
      'ipfs',
      'scatter'
    ],
    css: [
      'app.styl',
      'github-markdown.css'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'

      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    framework: {
      iconSet: 'eosdac-iconfont',

    },
    supportIE: false,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack(cfg) {
        //  cfg.module.rules.push({
        //    enforce: 'pre',
        //    test: /\.(js|vue)$/,
        //    loader: 'eslint-loader',
        //    exclude: /(node_modules|quasar)/
        //  })
        cfg.module.rules.push({
          resourceQuery: /blockType=i18n/,
          use: [{
              loader: '@kazupon/vue-i18n-loader'
            }
          ]
        })

        for (const rule of cfg.module.rules) {
          if (!rule.oneOf) continue
          for (const ruleOneOf of rule.oneOf) {
            ruleOneOf.use = ruleOneOf.use.filter(u => u.loader !== 'postcss-loader')
          }
        }
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSeparator',
        'QItemSide',
        'QItemTile',
        'QModal',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QField',
        'QInput',
        'QAlert',
        'Dialog',
        'QSpinner',
        'QSpinnerOval',
        'QInnerLoading',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardMedia',
        'QCardSeparator',
        'QCardActions',
        'QChip',
        'QBtnDropdown',
        'QScrollArea',
        'QCheckbox',
        'QPopover',
        'QSelect',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QCollapsible',
        'QProgress',
        'QSlideTransition',
        'QRadio',
        'QPagination',
        'QSearch',
        'QSlider',
        'QToggle'
      ],
      directives: [
        'Ripple',
        'CloseOverlay',
        'BackToTop'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'AppVisibility'
      ],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      // i18n: 'de' // Quasar language
      i18n: 'en-us'
    },
    // animations: 'all' --- includes all animations
    animations: [],
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack(cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
