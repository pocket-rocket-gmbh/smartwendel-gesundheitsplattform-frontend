<template>
  <div class="mx-15">
    <div class="my-5">
    <v-row justify="space-between">
      <v-col class="d-flex justify-start align-center is-uppercase">
        <h2 class="is-primary">Neuigkeiten</h2>
      </v-col>

      <v-col md="3" class="d-flex text--red justify-end align-start default-button">
        <v-btn 
          variant="flat"
          color="#007344"
          rounded="pill"
        >
          <span class = "text-white">
            Mehr Themen
          </span>
      </v-btn>
      </v-col>
    </v-row>
  </div>
  <div>
      <v-row>
        <v-col md="6" class="d-flex justify-start align-center" v-for="(item, index) in limitedCategories" :key="index">
          <v-card class="rounded-xl">
            <div class="d-flex notes-card">
              <img class="is-clickable" :src="item?.content.image" />
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
      <v-btn
      class="note-text-link mt-15"
      size="small"
      v-if="!showingAllArticles"
      @click="showMoreArticles()"
    >
    Mehr anzeigen >
    </v-btn>
    <v-btn
      v-if="showingAllArticles"
      class="note-text-link mt-15"
      size="small"
      @click="showLessArticles()"
    >
    &lt; Weninger anzeigen
    </v-btn>
  </div>
  </div>

  
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import image1 from '@/assets/images/current-notes/affenpocken.png'
import image2 from '@/assets/images/current-notes/pexels.png'
export default defineComponent({
  setup() {

    const articleLimit = ref(2)
    const showingAllArticles = ref(false)

    const items = [
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
      
      const limitedCategories = computed(() => { 
        return articleLimit.value ? items.slice(0,articleLimit.value) : articleLimit.value
      })

      const showMoreArticles = () => {
        articleLimit.value = 99
        showingAllArticles.value = true
      }

      const showLessArticles = () => {
        articleLimit.value = 2
        showingAllArticles.value = false
      }

      return {
      items,
      showMoreArticles,
      showLessArticles,
      limitedCategories,
      showingAllArticles
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

.default-button
  color: red


</style>