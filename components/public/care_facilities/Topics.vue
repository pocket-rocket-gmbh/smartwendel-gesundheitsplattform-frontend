<template>
<div>
  <div class="my-15">
    <v-row no-gutters>
      <v-col class="d-flex align-center">
        <div>
          <h2 class="is-primary is-uppercase mb-6">Ähnliche Themen</h2>
        </div>
      </v-col>
      <v-col md="3" class="d-flex justify-end align-start">
        <v-btn 
          variant="flat"
          color="primary"
          rounded="pill"
          >
          <span class="text-white">
            Mehr Themen
          </span>
        </v-btn>
      </v-col>
    </v-row>
  </div>
<div>
  <v-row>
    <v-col md="6" class="d-flex justify-start align-center" v-for="(item, index) in items" :key="index">
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
                class="primary"
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
    </div>  
  </div>
</template>

<script lang="ts">
import image1 from '@/assets/images/current-notes/affenpocken.png'
import image2 from '@/assets/images/current-notes/pexels.png'
export default defineComponent({
  props: {
    careFacility: {
      type: Object,
      required: true
    }
  },
  setup () {
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
    return {
    items,
    }
  }
})
</script>

<style lang="sass" scoped>
.box
  background: white
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.15)
  border-radius: 20px
  padding: 20px

</style>