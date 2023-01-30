<template>
  <div class="footer">
  <v-row no-gutters justify="space-between mx-10 mt-10">
    <v-col 
      cols="12"
      sm="12"
      md="6"
      class="d-flex justify-md-start justify-sm-center"
      >
      <div>
        <h2 class="footer-title text-uppercase mb-8">immer informiert – <br/> Mit dem Newsletter von Smart Wendeler land</h2>
        <p class="has-text-white mb-8">Alles zu aktuellen Gesundheitsangeboten und Gesundheitsthemen in deinem SMART WENDELER LAND. Jetzt anmelden und immer up to date sein:</p>
        <v-row>
          <v-col 
            cols="12"
            md="6"
            sm="12"
          >
          <PublicNewsletter />
          </v-col>
        </v-row>
      </div>
    </v-col>
    <v-col
      cols="12"
      sm="12"
      md="6"
      lg="6"
      class="d-flex justify-md-end justify-sm-center"
      >
      <div align="right">
        <h2 class="footer-title">Mehr News vom SMART WENDELER LAND</h2>
        <div class="mt-8"> 
          <v-btn
          href="https://www.facebook.com/Landkreis.StWendel/" target="_blank"
          variant="outlined"
          size="large"
          icon
          color="white"
          class="social-buttons"
          >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn
          href="https://www.instagram.com/sankt.wendeler.land/?hl=de" target="_blank"
          variant="outlined"
          size="large"
          icon
          color="white"
          class="social-buttons"
          >
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
        <v-btn
          href="https://www.youtube.com/channel/UCF9sq51TlbaRMWx9ePIRzog/about" target="_blank"
          variant="outlined"
          size="large"
          icon
          color="white"
          class="social-buttons"
          >
          <v-icon>mdi-youtube</v-icon>
        </v-btn>
          <v-btn
          href="https://www.linkedin.com/showcase/smart-wendeler-land" target="_blank"
          variant="outlined"
          size="large"
          icon
          color="white"
          class="social-buttons"
          >
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
        </div>
       
      </div>
    </v-col>
  </v-row>
  <div class="divider"></div>
  <div class="mx-10">

    <p class="has-text-white footer-title outer-footer">Kreisverwaltung Landkreis St. Wendel</p>
    <v-row no-gutters justify="space-between">
      <v-col 
      cols="12"
      lg="6"
      md="12"
      sm="12"
      class="d-flex justify-end align-center"
      >
        <v-row>
          <v-col>
            <p class="has-text-white">Mommstraße 21-31</p>
            <p class="has-text-white">66606 St. Wendel</p>
          </v-col>
          <v-col>
            <p class="has-text-white">Tel.: 06851 801-0</p>
            <p class="has-text-white">Fax: 06851 801-2290</p>
          </v-col>
          <v-col>
            <p class="has-text-white">Info(at)lkwnd.de</p>
            <p class="has-text-white font-italic">landkreis-st.wendel.de</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  
  
    <v-row no-gutters justify="space-between">
      <v-col class="mt-10">
        <p class="has-text-white is-clickable"><router-link to="/terms_of_use">Nutzungsbedingungen</router-link></p>
        <p class="has-text-white is-clickable"><router-link to="/privacy_policy">Datenschutzerklärung</router-link></p>
        <p class="has-text-white is-clickable"><router-link to="/imprint">Impressum</router-link></p>
      </v-col>
    </v-row>
  </div>
  
</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>

<style lang="sass" scoped>
.footer
  margin-top: 5rem
  a
    color: white

.footer-title
  color: white
  font-size: 1.8rem

.social-buttons
  margin: 0 10px
  border: 3px solid

.divider
  border: 2px white solid
  margin: 50px 0

.news-letter
  margin-top: 30px

.outer-footer
  margin-bottom: 20px
</style>