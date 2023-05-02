<template>
  <div class="mx-15">
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
            color="#007344"
            rounded="pill"
            class="mt-8"
          >
            <span class = "text-white">
              Alle Einrichtungen
            </span>
        </v-btn>
        </v-col>
        <v-col class="d-flex" md="6">
          <v-row>
            <v-col xl="6" class="d-flex" v-for="(item, index) in items" :key="index">
              <div class="ml-15 pa-2 d-flex ml-5 align-end">
                <div class="d-flex align-center is-clickable">
                  <img :src="item.content.icon" />
                  <div class="d-flex align-center">
                    <v-card-title class="has-font-size-medium is-light-blue font-weight-bold d-flex align-center is-clickable">
                      <span v-html="item.content.heading"></span>
                    </v-card-title>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
  </div>
</template>
<script lang="ts">
import icon1 from '@/assets/images/categories/icon_advice_center.png'
import icon2 from '@/assets/images/categories/icon_associations.png'
import icon3 from '@/assets/images/categories/icon_care_facilities.png'
import icon4 from '@/assets/images/categories/icon_doctor.png'
import icon5 from '@/assets/images/categories/icon_fitness.png'
import icon6 from '@/assets/images/categories/icon_hospitals.png'
import icon7 from '@/assets/images/categories/icon_offices.png'
import icon8 from '@/assets/images/categories/icon_pharmacies.png'
import icon9 from '@/assets/images/categories/icon_retirement.png'
import icon10 from '@/assets/images/categories/icon_school.png'

export default defineComponent({
  setup() {
    const items = [
        {
        'content': {
          heading: 'Ämter',
          icon: icon1
          }
        },
        {
        'content': {
          heading: 'Ärztinnen & Ärzte',
          icon: icon2
          }
        },
        {
        'content': {
          heading: 'Fitnesszentren',
          icon: icon3
          }
        },
        {
        'content': {
          heading: 'Pflegeeinrichtungen',
          icon: icon4
          }
        },
        {
        'content': {
          heading: 'Seniorenheime',
          icon: icon5
          }
        },
        {
        'content': {
          heading: 'Apotheken',
          icon: icon6
          }
        },
        {
        'content': {
          heading: 'Seniorenheime',
          icon: icon7
          }
        },
        {
        'content': {
          heading: 'Seniorenheime',
          icon: icon8
          }
        },
        {
        'content': {
          heading: 'Seniorenheime',
          icon: icon9
          }
        },
        {
        'content': {
          heading: 'Seniorenheime',
          icon: icon10
          }
        },
      ]

    return {
      items,
      
    }
  }
})
</script>

<style lang="sass" scoped>
.card-icons
  border-radius: 50%



</style>