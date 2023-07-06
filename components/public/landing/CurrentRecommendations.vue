<template>
  <div class="py-15 bg-gradient">
    <div class="d-flex align-center justify-center is-uppercase">
      <h2 class="text-white">Wir zeigen dir, was du für deine Gesundheitszustand und Wohlbefinden tun tuen können!</h2>
    </div>
    <div class="d-flex align-center justify-center text-white is-uppercase my-5">
      <h3>Bitte Bereich auswählen:</h3>
    </div>
    <v-row>
      <v-col class="flex-column justify-center text-center text-white align-center my-5" v-for="(item, index) in items" :key="index">
        <img class="is-clickable icons" :src="item.content.image" width="120"/>
        <div class="has-font-size-medium font-weight-bold">
          {{ item.content.heading }}
        </div>
      </v-col>
    </v-row>
  </div>  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/current-recommendations/icon_sport.svg'
import image2 from '@/assets/images/current-recommendations/icon_nutrition.svg'
import image3 from '@/assets/images/current-recommendations/icon_mental_health.svg'
import image4 from '@/assets/images/current-recommendations/icon_health_course.svg'
import image5 from '@/assets/images/current-recommendations/icon_free_time.svg'
export default defineComponent({
  setup() {
    const items = [
        {
        'content': {
          heading: 'Sport und Bewegung',
          image: image1,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Ernährung',
          image: image2,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Mentale Gesundheit',
          image: image3,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Gesundheitskurse',
          image: image4,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Freizeitgestaltung',
          image: image5,
          link: ''
          }
        }
      ]

      return {
      items
    }
  },
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.bg-gradient
  background: linear-gradient(85.85deg, #91A80D 5.31%, #BAC323 35.73%, #9EA100 77.83%)

.icons
  border-radius: 50%
  border: 1px solid white

</style>