<template>
  <v-container class="my-5">
    <v-row>
      <v-col class="d-flex justify-start align-center is-uppercase">
        <h2 class="is-primary">Wichtige aktuelle Hinweise</h2>
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
      <v-row>
        <v-col md="6" class="d-flex justify-center align-center" v-for="(item, index) in itens" :key="index">
          <v-card class="rounded-xl">
            <div class="d-flex notes-card">
              <img class="is-clickable" :src="item.content.image" />
              <div>
                <v-card-title class="note-title">
                  {{ item.content.heading }}
                </v-card-title>
                <div class="px-5 pb-5">
                  <p>{{ item.content.description }}</p>
                </div>
                <v-card-actions>
                  <v-btn
                    class="note-text-link"
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
  <v-container>
    <div class="divider my-10"></div>
  </v-container>
  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/current-notes/affenpocken.png'
import image2 from '@/assets/images/current-notes/pexels.png'
export default defineComponent({
  setup() {
    const itens = [
        {
        'content': {
          heading: 'Affenpocken',
          description: 'Bei Affenpocken handelt es sich um eine seltene Viruserkrankung, die durch das Affenpockenvirus verursacht wird. Affenpocken sind mit ...',
          image: image1,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Grippeimpfung Winter 2022/2023',
          description: 'Eine echte Virusgruppe ist keine einfach Erkältungs krankheit, sondern eine ernstzunehmende Erkrankung. Insbesondere chronisch ...',
          image: image2,
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

  .note-title
    color: #3CB5E7
    font-weight: 600
    font-size: 22px

  .note-text-link
    color: #017DC2
    font-size: 18px


</style>