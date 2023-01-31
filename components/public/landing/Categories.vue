<template>
  <v-container>
      <v-row justify="space-between">
        <v-col md="4" class="justify-center align-center is-dark-grey">
          <h2 class="is-primary is-uppercase mb-5">Pflege, Ärtze, <br/> Krankenhäuser und co.</h2>
          <p class="text-justify">
            Über diese Suchfunktion finden Sie sicher schnell die passenende Einrichtung und den richtigen Ansprechpartner.
          </p>
          <p class="text-justify mt-5">
             Ob in Bereich Pflege, Gesundheit oder Prävention. Sicher finden Sie unter mehr als 1.000 gelisteten Anbieten die Leistung, nach der Sie suchen. Informieren Sie sich über die Angebote oder nehmen Sie direkt Kontakt auf und vereinbaren Sie ihr persönliches Beratungsgespräch.
          </p>
          <v-btn
            variant="flat"
            color="info"
            rounded="pill"
            class="mt-8"
          >
            Auf der Karte Suchen
          </v-btn>
        </v-col>
        <v-col class="d-flex flex-wrap align-content-center justify-end">
          <v-card class="rounded-xl pa-3 d-flex ml-5 my-5 align-content-center justify-center is-clickable" v-for="(item, index) in itens" :key="index" min-width="300" min-height="100" elevation="10">
            <div class="d-flex align-center notes-card">
              <img :src="item.content.icon" height="50"/>
              <div class="d-flex align-center">
                <v-card-title class="has-font-size-medium is-light-blue font-weight-bold d-flex align-center">
                  <span v-html="item.content.heading"></span>
                </v-card-title>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
  <v-container>
    <div class="divider my-10"></div>
  </v-container>
  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import icon1 from '@/assets/images/categories/icon-aerzte.png'
import icon2 from '@/assets/images/categories/icon-krankenhaus.png'
import icon3 from '@/assets/images/categories/icon-pflegeeinrichtung.png'
import icon4 from '@/assets/images/categories/icon-apothekensuche.png'
import icon5 from '@/assets/images/categories/icon-kurse.png'
import icon6 from '@/assets/images/categories/icon-beratung.png'

export default defineComponent({
  setup() {
    const itens = [
        {
        'content': {
          heading: 'Ärztinnen und Ärzte',
          icon: icon1
          }
        },
        {
        'content': {
          heading: 'Krankenhäuser',
          icon: icon2
          }
        },
        {
        'content': {
          heading: 'Pflegeeinrichtungen <br> und -Angebote',
          icon: icon3
          }
        },
        {
        'content': {
          heading: 'Apothekensuche',
          icon: icon4
          }
        },
        {
        'content': {
          heading: 'Kurse & Angebote',
          icon: icon5
          }
        },
        {
        'content': {
          heading: 'Beratung & Hilfe',
          icon: icon6
          }
        }
      ]

    return {
      itens
    }
  }
})
</script>

<style lang="sass" scoped>



</style>