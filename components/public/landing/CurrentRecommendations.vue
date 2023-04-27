<template>
  <v-container class="pa-15 bg-green">
    <div class="d-flex align-center justify-center is-uppercase">
      <h2 >Wir zeigen Ihnen, was Sie für ihren Gesundheitszustand und Wohlbefinden tuen können!</h2>
    </div>
    <div class="d-flex align-center justify-center is-uppercase">
      <h3>Bitte wählen Sie, was am ehesten auf Sie zutrifft:</h3>
    </div>
    <v-row>
      <v-col class="flex-column justify-center text-center align-center" v-for="(item, index) in itens" :key="index">
        <img class="is-clickable" :src="item.content.image" width="130"/>
        <div class="has-font-size-medium is-light-blue font-weight-bold">
          {{ item.content.heading }}
        </div>
      </v-col>
    </v-row>
  </v-container>  
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
    const itens = [
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
      itens
    }
  },
})
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.bg-gradient
  color: linear-gradient(90deg, #91A80D 42.99%, #BAC323 68.59%, #9EA100 95.04%)


</style>