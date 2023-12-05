<template>
  <ClientOnly>
    <div class="wrapper pt-5 general-font-size">
      <div class="py-5" v-if="!useUser().loggedIn() && currentRoute !== '/register'">
        <v-row class="has-bg-grey register-hint">
          <v-col
            md="8"
            class="flex-column justify-start text-h4 has-bg-grey is-dark-grey font-weight-medium"
          >
            <div>Dein Angebot fehlt?</div>
            <div>Hier kannst du deine Einrichtung registrieren!</div>
          </v-col>
          <v-col
            class="d-flex justify-start register-button align-end justify-md-start ml-md-13"
          >
            <v-btn
              variant="flat"
              color="grey"
              class="general-font-size"
              rounded="pill"
              size="large"
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
        <v-row class="footer-content-row pa-0 ma-0">
          <v-col md="8">
            <v-row class="align-center bg-white">
              <v-col cols="6" md="3" sm="6" class="d-flex justify-center align-center">
                <a href="https://www.landkreis-st-wendel.de/" target="_blank">
                  <img
                    src="~/assets/images/sub-footer/logo-footer-wnd.png"
                    class="is-clickable logo-footer"
                    :class="[$device?.isMobile ? 'mobile-height' : 'desktop-height']"
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
            <v-row v-if="breakPoints.width.value > 960">
              <v-col>
                <div class="disclaimer text-wrap mt-5">
                  Zur besseren Lesbarkeit wird auf der Gesundheits- und Pflegeplattform
                  das generische Maskulinum verwendet. Die auf dieser Webseite verwendeten
                  Personenbezeichnungen sprechen – sofern nicht anders kenntlich gemacht –
                  alle Geschlechter an. Weibliche und anderweitige Geschlechteridentitäten
                  werden dabei ausdrücklich mit berücksichtigt.
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="links d-flex ma-0 pt-0 ml-n2 align-start">
            <div class="ml-md-15" :class="[breakPoints.width.value <= 960 ? 'mt-10' : '' ]">
              <span class="general-font-size font-weight-medium is-dark-grey"
                >Landkreis Sankt Wendel</span
              >
              <div class="footer-links">
                <p class="is-clickable is-dark-grey">
                  <span>
                    <a
                      class="is-dark-grey"
                      href="mailto:smartcity@lkwnd.de?subject=kontakt"
                      >Kontakt</a
                    >
                  </span>
                </p>
                <p class="is-clickable is-dark-grey">
                  <router-link class="is-dark-grey" to="/rules_of_conduct"
                    >Nutzungsbedingungen</router-link
                  >
                </p>
                <p class="is-clickable is-dark-grey">
                  <router-link class="is-dark-grey" to="/privacy_policy"
                    >Datenschutzerklärung</router-link
                  >
                </p>
                <p class="is-clickable is-dark-grey">
                  <router-link class="is-dark-grey" to="/imprint">Impressum</router-link>
                </p>
              </div>
              <div class="socials mt-5">
                <v-row>
                  <v-col>
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
                  </v-col>
                  <v-col>
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
                  </v-col>
                  <v-col>
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
                  </v-col>
                  <v-col>
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
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row v-if="breakPoints.width.value < 960">
          <v-col>
            <div class="disclamer text-wrap is-dark-grey general-font-size mt-5">
              Zur besseren Lesbarkeit wird auf der Gesundheits- und Pflegeplattform das
              generische Maskulinum verwendet. Die auf dieser Webseite verwendeten
              Personenbezeichnungen sprechen – sofern nicht anders kenntlich gemacht –
              alle Geschlechter an. Weibliche und anderweitige Geschlechteridentitäten
              werden dabei ausdrücklich mit berücksichtigt.
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const route = useRoute();
import { useBreakpoints } from "~/composables/ui/breakPoints";

const breakPoints = useBreakpoints();

const currentRoute = computed(() => {
  return route.path as string;
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"


.social-buttons
  border: 1px solid
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
  background-color: $light-grey
  margin: 5rem 0 0rem 0
  padding: 0 5rem 2rem
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

.disclamer
  @include md
    margin-bottom: 5rem
</style>
