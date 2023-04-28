<template>
      <div class="footer pt-15 px-5">
        <v-row>
          <v-col cols="12" md="6">
            <div class="my-10">
              <p class="text-uppercase">Benachrichtigung zu neuen Projekten</p>
              <p class="has-text-white">Jetzt zum SMART WENDELER LAND NEWSLETTER anmelden und über neue Projekte informiert werden:</p>
              <div class="gap-2" />
            </div>
            <PublicNewsLetter />
          </v-col>
          <v-col class="d-flex justify-md-end my-10">
            <div class="flex-column justify-end">
              <p class="footer-title">Mehr News vom SMART WENDELER LAND</p>
              <div class="gap-2" />
              <div class="my-10">
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
            </div>
          </v-col>
        </v-row>
        <div class="divider mb-10"></div>
        <p class="has-text-white footer-title mb-5">Landkreis Sankt Wendel</p>
        <v-row >
          <v-col cols="6" md="3" sm="6" class="flex-column justify-center align-center">
            <p class="has-text-white">Mommstraße 21-31</p>
            <p class="has-text-white">66606 St. Wendel</p>
            <div v-if="display.smAndDown && !display.smAndUp">
              <span>&nbsp;</span>
              <p class="has-text-white is-clickable"><router-link to="/terms_of_use">Nutzungsbedingungen</router-link></p>
              <p class="has-text-white is-clickable"><router-link to="/rules_of_conduct">Verhaltensregeln</router-link></p>
              <p class="has-text-white is-clickable"><router-link to="/privacy_policy">Datenschutzerklärung</router-link></p>
              <p class="has-text-white is-clickable"><router-link to="/imprint">Impressum</router-link></p>
            </div>
          </v-col>
          <v-col cols="6" md="3" sm="6" class="justify-center align-center">
            <p class="has-text-white">Tel.: 06851 801-0</p>
            <p class="has-text-white">Fax: 06851 801-2290</p>
            <span>&nbsp;</span>
            <p class="has-text-white">digitalregion.landkreis-st-wendel.de</p>
            <p class="has-text-white font-italic">smartcity@lkwnd.de</p>
          </v-col>
          <v-col md="1" v-if="display.mdAndDown && !display.mdAndUp"></v-col>
          <v-col v-if="display.smAndUp" class="flex-column justify-center align-center">
            <p class="has-text-white is-clickable"><router-link to="/terms_of_use">Nutzungsbedingungen</router-link></p>
            <p class="has-text-white is-clickable"><router-link to="/rules_of_conduct">Verhaltensregeln</router-link></p>
            <p class="has-text-white is-clickable"><router-link to="/privacy_policy">Datenschutzerklärung</router-link></p>
            <p class="has-text-white is-clickable"><router-link to="/imprint">Impressum</router-link></p>
          </v-col>
            <v-col md="3" sm="6" class="flex-column justify-center align-center">
              <div>
                Werden Sie Partner und registrieren Sie Ihre Institution
              </div>
              <div>
                >> HIER ANMELDEN
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


.social-buttons
  border: 3px solid

.divider
  border: 2px &dark-grey solid

.input-field
  border: 2px solid red
  border-radius: 25px


</style>