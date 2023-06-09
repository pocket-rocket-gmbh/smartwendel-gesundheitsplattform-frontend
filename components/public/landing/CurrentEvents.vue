<template>
  <div class="mx-15">
    <div class="my-15">
      <v-row no-gutters>
        <v-col class="d-flex align-center">
          <div>
            <img src="~/assets/images/logo.png" width="190"/>
          </div>
          <div class="mx-15">
            <h2 class="is-primary">Kurse & Veranstaltungen</h2>
          </div>
        </v-col>
        <v-col md="3" class="d-flex justify-end align-start">
          <v-btn 
            variant="flat"
            color="#007344"
            rounded="pill"
            >
            <span class = "text-white">
              Mehr Kurse
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
            <v-card-title class="note-title is-primary">
              {{ item.content.heading }}
            </v-card-title>
            <div class="px-5 pb-5">
              <p>{{ item.content.description }}</p>
            </div>
            <v-card-actions>
              <v-btn
                color="secondary"
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
    <v-row>
      <v-col cols="12" md="6" offset="5" class="mt-10">
        <v-btn 
          v-if="!showingAllArticles"
          variant="outlined"
          size="large"
          rounded="pill"
          color="primary"
          @click="showMoreArticles()"
          >
          Mehr anzeigen
        </v-btn>
        <v-btn 
          v-if="showingAllArticles"
          variant="outlined"
          size="large"
          rounded="pill"
          color="primary"
          @click="showLessArticles()"
          >
          Weniger anzeigen
        </v-btn>
      </v-col>
    </v-row>
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
          heading: 'Rückenfit',
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et ...',
          image: image1,
          link: ''
          }
        },
        {
        'content': {
          heading: 'Yoga für Einsteiger',
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et ...',
          image: image2,
          link: ''
          }
        },
        {
        'content': {
          heading: 'test',
          description: 'Lorem ipsum dolor sit amet, consetetur sadipscing labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et ...',
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
    font-weight: 600
    font-size: 22px

  .note-text-link
    font-size: 18px


</style>