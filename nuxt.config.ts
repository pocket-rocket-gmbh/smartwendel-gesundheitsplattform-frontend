// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '@/assets/sass/main.sass', 'leaflet/dist/leaflet.css'],

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-icons',
    '@nuxtjs/device',
    '@sentry/nuxt/module',
  ],

  // @ts-ignore
  sentry: {
    sourceMapsUploadOptions: {
      org: "pocket-rocket-gmbh",
      project: "javascript-nuxt",
      authToken: "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",
    },
  },

  experimental: {
    treeshakeClientOnly: false
  },

  runtimeConfig: {
    PUBLIC_API_USERNAME: process.env.PUBLIC_API_USERNAME,
    PUBLIC_API_PASSWORD: process.env.PUBLIC_API_PASSWORD,
    REGISTER_TOKEN: process.env.REGISTER_TOKEN,
    SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
    LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
    public: {
      WEB_SOCKET_URL: process.env.WEB_SOCKET_URL,
      API_BASE_URL: process.env.API_BASE_URL
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: 'Gesundheitsplattform' }
      ],
      link: [
        { rel: 'icon', type: "image/png", href: '/favicon.ico' }
      ],
    }
  },

  devtools: {
    timeline: {
      enabled: true
    }
  },

  compatibilityDate: '2024-09-23'
})