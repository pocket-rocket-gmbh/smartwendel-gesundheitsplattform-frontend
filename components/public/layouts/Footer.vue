<template>
  <div class="footer pt-15 px-5 is-dark-grey">
    <v-row class="mb-10 font-weight-bold">
      <v-col class="flex-column justify-center">
        <h2 class="mb-5">Landkreis Sankt Wendel</h2>
        <p class="has-text-white is-clickable"><router-link to="/contact">Kontakt</router-link></p>
        <p class="has-text-white is-clickable"><router-link to="/rules_of_conduct">Nutzungsbedingungen</router-link></p>
        <p class="has-text-white is-clickable"><router-link to="/privacy_policy">Datenschutzerklärung</router-link></p>
        <p class="has-text-white is-clickable"><router-link to="/imprint">Impressum</router-link></p>
      </v-col>
      <v-col class="d-flex justify-end align-center">
        <div>
          <div>
            <v-btn
              href="https://www.facebook.com/Landkreis.StWendel/" target="_blank"
              variant="outlined"
              size="large"
              icon
              class="social-buttons mr-5"
              >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn
              href="https://www.instagram.com/sankt.wendeler.land/?hl=de" target="_blank"
              variant="outlined"
              size="large"
              icon
              class="social-buttons mr-5"
              >
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn
              href="https://www.youtube.com/channel/UCF9sq51TlbaRMWx9ePIRzog/about" target="_blank"
              variant="outlined"
              size="large"
              icon
              class="social-buttons mr-5"
              >
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
            <v-btn
            href="https://www.linkedin.com/showcase/smart-wendeler-land" target="_blank"
            variant="outlined"
            size="large"
            icon
            class="social-buttons"
            >
              <v-icon>mdi-linkedin</v-icon>
          </v-btn>
          </div>
            <div class="flex-column mt-10" v-if="!useUser().loggedIn()">
              <div>
                Werden Sie Partner und registrieren Sie Ihre Institution
              </div>
            <div>
              <nuxt-link to="/register">>> HIER ANMELDEN</nuxt-link>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const display = ref(useDisplay())

</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"


.social-buttons
  border: 3px solid

.divider
  border: 1px $dark-grey solid

.input-field
  border: 2px solid red
  border-radius: 25px


</style>