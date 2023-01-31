<template>
  <v-container class="my-5">
    <v-row>
      <v-col class="d-flex justify-start align-center is-uppercase">
        <h2 class="is-primary">Aktuelle Informationen zu Gesundheitsthemen</h2>
      </v-col>
      <v-col md="3" class="d-flex justify-end align-center">
        <v-btn
            variant="flat"
            color="info"
            rounded="pill"
          >
          Alle Informationen ansehen
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
      <v-row class="d-flex">
        <v-col md="4" class="flex-column justify-center align-center" v-for="(item, index) in itens" :key="index">
          <v-card class="rounded-xl">
            <div class="flex-column notes-card">
              <img class="is-clickable" :src="item.content.image" height="300"/>
              <div>
                <v-card-title class="has-font-size-medium is-light-blue font-weight-bold">
                  {{ item.content.heading }}
                </v-card-title>
                <div class="px-5 pb-5">
                  <p>{{ item.content.description }}</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="has-font-size-small-medium is-dark-blue"
                    size="small"
                  >
                  Mehr erfahren >
                  </v-btn>
                </v-card-actions>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/health-notes/ernaehrung.jpg'
import image2 from '@/assets/images/health-notes/diabetes.jpg'
import image3 from '@/assets/images/health-notes/grippeimpfung.png'
export default defineComponent({
  setup() {
    const itens = [
        {
        'content': {
          heading: 'Was ist eine gesunde Ernährung?',
          description: 'Was für die einen ungesund ist, bekommt anderen recht gut. Heißt auch: Jeder bekommt einen Klinik und Praxis und natürlich die interdisziplinäre ...',
          image: image1,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Diabätisforum 2023',
          description: 'Das Forum für professionelle Diabetiker-Versorgung: Themen wie Qualitätsmanagement in Klinik und Praxis und natürlich die interdisziplinäre ...',
          image: image2,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Tai Chi für mehr innere Balance',
          description: 'Ruhe Harmonie und Ausgelassenheit verspricht Tai Chi. Die fernöstlichen Heilmethoden verhelfen dem Körper zu neuer Energie und sind dabei ...<',
          image: image3,
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

</style>