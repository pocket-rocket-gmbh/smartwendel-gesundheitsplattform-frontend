<template>
  <div class="mx-15 my-10">
    <v-row>
      <v-col class="d-flex justify-center align-center is-dark-grey">
        <div>
          <h2 class="is-uppercase my-5">{{ subCategory.name }}</h2>
          <span class="my-5" v-html="subCategory.description"></span>
        </div>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col md="6" class="d-flex justify-start align-center mt-10 " v-for="(item, index) in subSubCategories" :key="index">
        <v-card class="rounded-xl mx-auto has-bg-light-grey">
          <div class="d-flex notes-card">
            <v-img
              cover
              width="300"
              aspect-ratio="16/9"
              :src="item.image_url"
            />
            <div>
              <v-card-title class="note-title is-primary">
                {{ item.name }}
              </v-card-title>
              <div class="px-5 pb-5">
                <p>{{ item.description }}</p>
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
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  subSubCategories: {
    required: true
  },
  subCategory: {
    required: true
  },
})



const subSubCategories = ref(props.subSubCategories)
const subSubCasubCategorytegories = ref(props.subCategory)

</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.note-title
  font-weight: 600
  font-size: 22px

.note-text-link
  font-size: 18px

</style>