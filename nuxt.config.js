export default {
  target: 'static',
  ssr: true,

  head: {
    title: 'System rekrutacji uniwersyteckiej',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Portal rekrutacyjny dla kandydatów' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
    ]
  },

  css: [
    '~/assets/apple-style.css'
  ],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [],

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#007AFF',
          secondary: '#5856D6',
          accent: '#FF9500',
          error: '#FF3B30',
          info: '#5AC8FA',
          success: '#34C759',
          warning: '#FF9500',
          background: '#F2F2F7',
          surface: '#FFFFFF'
        }
      },
      options: {
        customProperties: true
      }
    },
    defaultAssets: {
      font: {
        family: 'Inter'
      },
      icons: 'mdi'
    },
    treeShake: true
  },

  build: {}
}
