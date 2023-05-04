<template>
  <div class="pa-15 bg-gradient">
    <div class="d-flex align-center justify-center is-uppercase">
      <h2 class="text-white">Wir zeigen Ihnen, was Sie für ihren Gesundheitszustand und Wohlbefinden tuen können!</h2>
    </div>
    <div class="d-flex align-center justify-center text-white is-uppercase my-5">
      <h3>Bitte wählen Sie, was am ehesten auf Sie zutrifft:</h3>
    </div>
    <v-row>
      <v-col class="flex-column justify-center text-center text-white align-center my-5" v-for="(item, index) in items" :key="index">
        <img class="is-clickable" :src="item.content.image" width="150"/>
        <div class="has-font-size-medium font-weight-bold">
          {{ item.content.heading }}
        </div>
      </v-col>
    </v-row>
  </div>  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/current-recommendations/icon_sport.png'
import image2 from '@/assets/images/current-recommendations/icon_nutrition.png'
import image3 from '@/assets/images/current-recommendations/icon_health.png'
import image4 from '@/assets/images/current-recommendations/icon_course.png'
import image5 from '@/assets/images/current-recommendations/icon_freetime.png'
export default defineComponent({
  setup() {
    const items = [
        {
        'content': {
          heading: 'Sport & Bewegung',
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
  background: linear-gradient(90.63deg, #00783B 6.11%, #009E55 36.69%, #006B38 89.88%)


</style>