<template>
  <div class="ma-15">
    <v-row>
      <v-col  v-for="(item, index) in items" :key="index">
        <div class="justify-center text-center align-center">
          <div class="icons d-flex justify-center align-center ma-5">
            <img class="is-clickable" :src="item.content.image" min-width="50" max-width="50"/>
          </div>
        <h3 class="is-dark-grey my-5 font-weight-bold" >
          {{ item.content.heading }}
        </h3>
        <div class=" my-5 is-dark-grey ">
          {{ item.content.description }}
        </div>
        <div>
          <a :href="item.content.linkText" target="_blank" class="is-red is-clickable">
            {{ item.content.linkText }}
          </a>
        </div>
        </div>
      </v-col>
    </v-row>
  </div>  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/help-links/icon_ambulance.svg'
import image2 from '@/assets/images/help-links/icon_suitcase.svg'
import image3 from '@/assets/images/help-links/icon_pinmap.svg'
export default defineComponent({
  setup() {
    const items = [
        {
        'content': {
          heading: 'Sport & Bewegung',
          image: image1,
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
          linkText:'Anleitung',
          link: 'https://www.drk.de/hilfe-in-deutschland/erste-hilfe/'
          }
        },
        {
        'content': {
          heading: 'Ernährung',
          image: image2,
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
          linkText: 'Notruf 112',
          link: ''
          }
        },
        {
        'content': {
          heading: 'Mentale Gesundheit',
          image: image3,
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
          linkText: 'Notruf 22833',
          link: '',
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


</style>