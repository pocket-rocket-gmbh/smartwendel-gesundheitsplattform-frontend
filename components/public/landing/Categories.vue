<template>
  <div class="mx-15 my-15">
      <v-row justify="space-between">
        <v-col md="4" class="justify-center align-center is-dark-grey">
          <h2 class="is-primary text-h4 font-weight-bold text-uppercase mb-5">Pflege, Ärtze, <br/> Krankenhäuser und co.</h2>
          <p class="text-justify">
            Über diese Suchfunktion findest du sicher schnell die passende Einrichtung und den richtigen Ansprechpartner.
          </p>
          <p class="text-justify mt-5">
             Ob in Bereich Pflege, Gesundheit oder Prävention. Sicher findest du unter mehr als 1.000 gelisteten Anbieten die Leistung, nach der du suchst. Informierest du über die Angebote oder nimmst direkt Kontakt auf und vereinbarst du persönliches Beratungsgespräch.
          </p>
          <div class="my-5">
            <v-btn 
              variant="flat"
              color="primary"
              rounded="pill"
              size="large"
              @click="goToSearch()"
              >
              <span>
                Alle Einrichtungen
              </span>
            </v-btn>
          </div>
        </v-col>
        <v-col class="d-flex" xl="6" md="8">
          <v-row>
            <v-col class="d-flex" v-for="(item, index) in items" :key="index">
              <div class="ml-15 pa-2 d-flex ml-5 align-end">
                <div class="d-flex align-center is-clickable">
                  <img class="icons" :src="item.content.icon" />
                  <div class="d-flex align-center">
                    <v-card-title class="has-font-size-medium font-weight-bold d-flex align-center is-clickable">
                      <span class="is-dark-grey" v-html="item.content.heading"></span>
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
import icon1 from '@/assets/images/categories/icon_doctor.svg'
import icon2 from '@/assets/images/categories/icon_fitness.svg'
import icon3 from '@/assets/images/categories/icon_clubs.svg'
import icon4 from '@/assets/images/categories/icon_pharmacies.svg'
import icon5 from '@/assets/images/categories/icon_caring.svg'
import icon6 from '@/assets/images/categories/icon_house.svg'

export default defineComponent({
  setup() {
    const router = useRouter()

    const goToSearch = () => {
      router.push({ path: '/public/search/facilities'})
    }

    const items = [
        {
        'content': {
          heading: 'Ärztinnen & Ärzte',
          icon: icon1
          }
        },
        {
        'content': {
          heading: 'Fitnesseinrichtungen',
          icon: icon2
          }
        },
        {
        'content': {
          heading: 'Vereine',
          icon: icon3
          }
        },
        {
        'content': {
          heading: 'Apotheken',
          icon: icon4
          }
        },
        {
        'content': {
          heading: 'Pflegeeinrichtungen',
          icon: icon5
          }
        },
        {
        'content': {
          heading: 'Wohnheime',
          icon: icon6
          }
        }
      ]

    return {
      items,
      goToSearch
    }
  }
})
</script>

<style lang="sass" scoped>
.icons
  border-radius: 50%
  border: 1px solid black
  background-color: white
  &:hover
    transform: scale(1.1)
    transition: transform 0.5s ease-in-out
    cursor: pointer

</style>