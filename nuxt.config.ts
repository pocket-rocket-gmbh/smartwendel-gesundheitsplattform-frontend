// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass', '@mdi/font/css/materialdesignicons.min.css', '@/assets/sass/main.sass', 'leaflet/dist/leaflet.css'],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-icons'
  ],
  experimental: {
    treeshakeClientOnly: false
  },
  runtimeConfig: {
    // TODO: outsource in private scope. current not working well
    // https://nuxt.com/docs/guide/going-further/runtime-config
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
      LOGIN_PASSWORD: process.env.LOGIN_PASSWORD,
      PUBLIC_API_USERNAME: process.env.PUBLIC_API_USERNAME,
      PUBLIC_API_PASSWORD: process.env.PUBLIC_API_PASSWORD,
      REGISTER_TOKEN: process.env.REGISTER_TOKEN
    },
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
