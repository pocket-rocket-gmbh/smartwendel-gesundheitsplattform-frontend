import VueMatomo from 'vue-matomo'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueMatomo, {
   
    router: nuxtApp.$router,
    host: 'https://matomo.pocket-rocket.io',
    siteId: 100,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: false,
    requireCookieConsent: false,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 5,
    trackerFileName: 'piwik',
    trackerUrl: 'https://matomo.pocket-rocket.io/matomo.php',
    trackerScriptUrl: 'https://matomo.pocket-rocket.io/matomo.js',
    userId: ''
  })
})
