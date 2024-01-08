<template>
  <div :class="['cookie-box-small', { 'expanded' : expanded }]" @mouseover="expanded = !cookieBoxOpen && !showingOptions" @mouseleave="expanded = false" @click="showFrame = true, cookieBoxOpen = true">
    <div class="cookie-content">
      <img :class="['cookie-image', { 'mascot-transformed' : cookieBoxOpen && !showingOptions }, { 'is-mobile' : $device.isMobile }, { 'is-desktop' : $device.isDesktop }]" src="~/assets/images/cookie-small.png" height="50" />
      <div class="mt-2">
        Cookie Einstellungen verwalten
      </div>
    </div>
  </div>
  <div v-if="showFrame">
    <div class="curtain" />
    <div class="cookie-banner" v-if="!showingOptions">
    <div class="cookie-box has-text-grey" :class="[($device.isMobile ? 'is-mobile' : 'is-desktop')]" align="center" v-if="cookieBoxOpen">
      <div class="content">
        <div class="headline">Möchtest Du ein Cookie?</div>
        <div class="mt-6 mb-15">Hey! Wir benutzen Cookies, um sicherzustellen,<br/> dass du die beste Erfahrung auf unserer Webseite hast!</div>
      </div>
      <div class="footer">
        <v-row class=" button-wrap" justify="space-between">
        <v-col @click="showingOptions = true" class="configure-button">
          <div >
            <p>Verwalten</p>
          </div>
        </v-col>
        <v-col @click="cookieBoxOpen = false, emitSetCookie(), dissmissHint()" class="accept-button">
          <p>Akzeptieren </p>
        </v-col>
      </v-row>
      </div>
    </div>
    <img src="@/assets/images/mascot.svg" class="mascot" />
  </div>
  <div v-else class="cookies-box" :class="[($device.isMobile ? 'is-mobile' : 'is-desktop')]">
    <img class="close is-clickable" src="~/assets/images/icon-times.svg" height="20" @click="showingOptions = false"/>
    <v-container>
      <v-row>
        <v-col class="justify-center align-center my-8">
          <div class="mt-1 mb-8">
            <span>
              Deine Zufriedenheit ist unser Ziel, deshalb verwenden wir Cookies. Cookies werden benötigt, damit unsere Webseite zuverlässig und sicher läuft, wir die Performance im Blick behalten und Dich besser ansprechen können. Wenn du  deine Zustimmung nicht erteilst oder zurückziehst, können bestimmte Merkmale und Funktionen beeinträchtigt werden. Erfahre in unseren
              <span class="has-text-primary">
                <router-link to="/privacy_policy">Datenschutzbestimmungen</router-link>
              </span>
              mehr zum Thema Cookies.
            </span>
          </div>
          <div>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <template v-slot:default="{ expanded }">
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex justify-start">
                        Essentielle Cookies
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div>
                    Dies sind technische Cookies, die für das einwandfreie Funktionieren unserer Webseite und aller Funktionen, die sie bietet, notwendig sind:
                  </div>
                  <div class="pa-3">
                    Sicherung Anmeldedaten: Nach der Registrierung werden Anmeldedaten aufgezeichnet, sodass der Nutzer auch nach einem Seitenwechsel angemeldet bleibt.
                  </div>
                  <div class="pa-3">
                    Sicherung Nutzung: Die Cookies tragen zu einer sicheren und ordnungsgemäßen Nutzung unserer Webseite bei.
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>
                  <template v-slot:default="{ expanded }">
                    <v-row no-gutters>
                      <v-col cols="4" class="d-flex justify-start">
                        Analyse / Statistiken 
                      </v-col>
                    </v-row>
                  </template>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-switch
                    color="primary"
                    :model-value="true"
                    hide-details
                    label="Um unsere Webseite optimal zu gestalten und fortlaufend verbessern zu können, verwenden wir das Open Source-Tool „Matomo“. Die damit gewonnen Daten werden anonymisiert gespeichert und verlassen unseren Server nicht."
                  />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="d-flex justify-end align-center">
          <div class="is-clickable px-3 has-text-primary" @click="cookieBoxOpen = false, showingOptions = false, showFrame = false">
            <router-link to="/privacy_policy">Datenschutzerklärung</router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-row no-gutters class="text-center mt-7" justify="space-between" @click="cookieBoxOpen = false, showingOptions = false, dissmissHint(), emitSetCookie()">
      <v-col class="is-clickable">
        <div class="footer-save">
          <p>Speichern</p>
        </div>
      </v-col>
    </v-row>
  </div>
</div>
</template>

<script>
  export default defineComponent({
  name: 'CookieBanner',
  setup() {
    const expanded = ref(false)
    const cookieBoxOpen = ref(false)
    const showingOptions = ref(false)
    const showFrame = ref(true)

    const emitClose = () => {
      emit('close')
    }

    const emitSetCookie = () => {
      useNuxtApp().$bus.$emit('cookieCookieSet')
    }
    
    const dissmissHint = () => {
      localStorage.setItem('platform_cookies_accepted', "true")
      showFrame.value = false
    }

    onMounted(() => {
      const showStorage = localStorage.getItem('platform_cookies_accepteds')
      if (showStorage && showStorage === 'true') {
        showFrame.value = false
        cookieBoxOpen.value = false
        } else {
          setTimeout(() => {
          cookieBoxOpen.value = true
          showFrame.value = true
        }, 1)
      }
    })

    return {
      emitClose,
      expanded,
      cookieBoxOpen,
      showingOptions,
      dissmissHint,
      showFrame,
      emitSetCookie
    }
  },
})
</script>

<style lang="sass" scoped>
.cookie-box-small
  background: #FFFFFF
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15)
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
  width: 270px
  position: absolute
  padding: 20px
  top: 15px
  right: 10%
  z-index: 100
  transition-timing-function: ease-out
  text-align: center
  transition: .3s
  cursor: pointer
  &.expanded
    top: 80px
  .cookie-content
    position: relative
    top: 10px
    width: 100%
    height: 100%
    .cookie-image
      position: absolute
      left: -30px
      top: 10px
      transition-timing-function: ease-out
      transition: .5s
      z-index: 100
      &.is-mobile
        left: 70%
      &.mascot-transformed
        opacity: 0.7
        position: fixed
        margin-right: -50%
        z-index: 100
        &.is-mobile
          top: 82%
          left: 37%
        &.is-desktop
          top: 81%
          left: 46.7%


.cookie-box
  width: auto
  background: #FFFFFF
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  position: fixed
  top: 50%
  left: 50%
  margin-right: -50%
  transform: translate(-50%, -50%)
  display: grid
  place-items: center
  z-index: 100
  .content
    padding: 20px
    .headline
      font-size: 30px
.footer
  text-transform: uppercase
  position: absolute
  bottom: -1px
  width: 100%
  cursor: pointer

.footer-save
  background: linear-gradient(204.8deg, #017EC2 11.22%, #015382 93.01%)
  color: white
  text-transform: uppercase
  position: absolute
  bottom: -1px
  width: 100%
  border-bottom-left-radius: 20px
  border-bottom-right-radius: 20px
  padding: 10px
  cursor: pointer

.mascot
  width: 150px
  position: fixed
  top: 75%
  left: 50%
  margin-right: -50%
  transform: translate(-50%, -50%)
  z-index: 99
  margin-top: 40px

.configure-button
  background: #D3D3D3
  border-bottom-left-radius: 20px

.accept-button
  color: white
  background: linear-gradient(204.8deg, #017EC2 11.22%, #015382 93.01%)
  border-bottom-right-radius: 20px

.v-row.button-wrap
  margin: 0

</style>