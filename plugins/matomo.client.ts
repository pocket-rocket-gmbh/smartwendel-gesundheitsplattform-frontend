import VueMatomo from 'vue-matomo'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(VueMatomo, {
   
    router: nuxtApp.$router,
    host: 'https://rocketinsights.de',
    siteId: 10,
    enableLinkTracking: true,
    requireConsent: false,
    trackInitialView: true,
    disableCookies: false,
    requireCookieConsent: false,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 5,
    trackerFileName: 'piwik',
    trackerUrl: 'https://rocketinsights.de/matomo.php',
    trackerScriptUrl: 'https://rocketinsights.de/matomo.js',
    userId: ''
  })
})
