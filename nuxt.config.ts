// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '@/assets/sass/main.sass', 'leaflet/dist/leaflet.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-icons',
    '@nuxtjs/device'
  ],
  experimental: {
    treeshakeClientOnly: false
  },
  runtimeConfig: {
    PUBLIC_API_USERNAME: process.env.PUBLIC_API_USERNAME,
    PUBLIC_API_PASSWORD: process.env.PUBLIC_API_PASSWORD,
    REGISTER_TOKEN: process.env.REGISTER_TOKEN,
    SENDINBLUE_API_KEY: process.env.SENDINBLUE_API_KEY,
    public: {
      WEB_SOCKET_URL: process.env.WEB_SOCKET_URL,
      API_BASE_URL: process.env.API_BASE_URL
    }
  },
  app: {
    head: {
      charset: 'utf-16',
      viewport: 'width=500, initial-scale=1',
      title: 'SMART WENDELER LAND',
      meta: [
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'SMART WENDELER LAND' },
        { property: 'og:description', content: 'Gesundheitsplattform' }
      ],
    }
  }
})
