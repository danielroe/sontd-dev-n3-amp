// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: ['~/plugins/vuetify.ts', '~/plugins/api-service.ts'],

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/sass/main.scss',
  ],

  build: {
    transpile: ['vuetify'],
  },

  modules: ['@pinia/nuxt', './modules/auth', '@nuxtjs/i18n-edge'],

  routeRules: {
    '/admin/**': { ssr: false },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE_URL,
      debugEnable: process.env.NUXT_DEBUG_ENABLE === 'true',
    },
  },

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.yml', name: 'English' },
      { code: 'vi', iso: 'vi-VN', file: 'vi-VN.yml', name: 'Tiếng Việt' },
      { code: 'ja', iso: 'ja-JP', file: 'ja-JP.yml', name: '日本語' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en',
  },

  auth: {
    endpoints: {
      baseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      login: {
        url: '/login',
        method: 'POST',
        property: 'data',
      },
      logout: { url: '/logout', method: 'DELETE' },
      refresh: {
        url: '/refresh_tokens',
        method: 'POST',
        property: 'data',
      },
      user: {
        url: '/me',
        method: 'GET',
        property: 'data',
      },
      signup: { url: '/signup', method: 'POST' },
    },
    token: {
      headerName: 'Authorization',
      type: 'Bearer',
      property: 'token',
    },
    refreshToken: {
      paramName: 'token',
      property: 'refresh_token',
    },
    cookie: {
      ssl: process.env.NUXT_ENABLE_HTTPS === 'true',
    },
    middleware: {
      global: true,
    },
    redirect: {
      login: '/login',
      logout: '/',
      home: '/',
    },
    rewriteRedirects: true,
  },
});
