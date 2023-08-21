<template>
  <ClientOnly>
    <div class="wrapper has-bg-grey">
      <div
        class="has-bg-grey py-5"
        v-if="!useUser().loggedIn() && currentRoute !== '/register'"
      >
        <v-row class="align-center register-hint">
          <v-col
            md="8"
            class="flex-column justify-start text-h3 is-dark-grey font-weight-bold"
          >
            <div>Dein Angebot fehlt?</div>
            <div>Hier kannst du deine Einrichtung registrieren!</div>
          </v-col>
          <v-col class="d-flex justify-center register-button">
            <v-btn
              variant="flat"
              color="grey"
              rounded="pill"
              size="x-large"
              href="/register"
            >
              <span>Jetzt registrieren</span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
      <v-divider
        v-if="!useUser().loggedIn() && currentRoute !== '/register'"
        class="py-5"
        thickness="2"
      ></v-divider>
      <div class="footer-content">
        <v-row class="footer-content-row align-center">
          <v-col md="8">
            <v-row class="align-center bg-white">
              <v-col cols="6" md="3" sm="6" class="d-flex justify-center align-center">
                <a href="https://www.landkreis-st-wendel.de/" target="_blank">
                  <img
                    src="~/assets/images/sub-footer/logo-footer-wnd.png"
                    class="is-clickable logo-footer"
                    :class="[$device.isMobile ? 'mobile-height' : 'desktop-height']"
                  />
                </a>
              </v-col>
              <v-col cols="6" md="3" sm="6" class="d-flex justify-center align-center">
                <a href=" https://www.wfg-wnd.de/" target="_blank">
                  <img
                    src="~/assets/images/sub-footer/logo-footer-wfg.png"
                    class="is-clickable logo-footer"
                    :class="[
                      $device.isMobile
                        ? 'mobile-bigger-width'
                        : 'desktop-height desktop-height-wfg',
                    ]"
                  />
                </a>
              </v-col>
              <v-col cols="6" md="3" sm="6" class="d-flex justify-center align-center">
                <a href="https://www.bmwsb.bund.de" target="_blank">
                  <img
                    src="~/assets/images/sub-footer/logo-bundesministerium.png"
                    class="is-clickable logo-footer"
                    :class="[$device.isMobile ? 'mobile-height' : 'desktop-height']"
                  />
                </a>
              </v-col>
              <v-col cols="6" md="3" sm="6" class="d-flex justify-center align-center">
                <a href="https://www.kfw.de/kfw.de.html" target="_blank">
                  <img
                    src="~/assets/images/sub-footer/logo-footer-kfw.png"
                    class="is-clickable logo-footer"
                    :class="[$device.isMobile ? 'mobile-height' : 'desktop-height-kfw']"
                  />
                </a>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="links d-flex align-center">
            <div>
              <h2 class="mb-5">Landkreis Sankt Wendel</h2>
              <div class="footer-links">
                <p class="has-text-white is-clickable">
                  <router-link to="/contact">Kontakt</router-link>
                </p>
                <p class="has-text-white is-clickable">
                  <router-link to="/rules_of_conduct">Nutzungsbedingungen</router-link>
                </p>
                <p class="has-text-white is-clickable">
                  <router-link to="/privacy_policy">Datenschutzerklärung</router-link>
                </p>
                <p class="has-text-white is-clickable">
                  <router-link to="/imprint">Impressum</router-link>
                </p>
              </div>
              <div class="socials mt-5">
                <v-btn
                  href="https://www.facebook.com/Landkreis.StWendel/"
                  target="_blank"
                  variant="outlined"
                  size="large"
                  icon
                  class="social-buttons mr-5"
                >
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn
                  href="https://www.instagram.com/sankt.wendeler.land/?hl=de"
                  target="_blank"
                  variant="outlined"
                  size="large"
                  icon
                  class="social-buttons mr-5"
                >
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
                <v-btn
                  href="https://www.youtube.com/channel/UCF9sq51TlbaRMWx9ePIRzog/about"
                  target="_blank"
                  variant="outlined"
                  size="large"
                  icon
                  class="social-buttons mr-5"
                >
                  <v-icon>mdi-youtube</v-icon>
                </v-btn>
                <v-btn
                  href="https://www.linkedin.com/showcase/smart-wendeler-land"
                  target="_blank"
                  variant="outlined"
                  size="large"
                  icon
                  class="social-buttons"
                >
                  <v-icon>mdi-linkedin</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
const route = useRoute();
const display = ref(useDisplay());

const currentRoute = computed(() => {
  return route.path as string;
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"


.social-buttons
  border: 3px solid
  color: $dark-grey
  &:visited
    color: $dark-grey

.divider
  border: 1px $dark-grey solid

.input-field
  border: 2px solid red
  border-radius: 25px

.sub-footer
  background: white

.mobile-height
  max-width: 100px

.desktop-height
  max-width: 150px

.desktop-height-kfw
  max-width: 100px

.mobile-bigger-width
  max-width: 150px

.footer-links
  line-height: 1.8rem

.wrapper
  margin-top: 5rem
  padding: 0 5rem
  @include md
    padding: 0 1rem

  .register-hint
    @include md
      flex-direction: column
      justify-content: stretch

      .register-button
        a
          flex: 1

.footer-content
  .footer-content-row
    @include md
      flex-direction: column

  .links
    flex-direction: column

    @include md
      justify-content: stretch

    .socials
      @include md
        display: flex
        justify-content: space-between
</style>
