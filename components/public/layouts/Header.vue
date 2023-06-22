<template>
  <v-app-bar scroll-behavior="hide" :elevation="2" density="compact" class="title-bar pa-3">
      <v-spacer></v-spacer>
      <div class="flex-column">
        <div class="is-uppercase has-font-size-big d-flex align-center justify-center pt-15">
          <h2 class="is-white" v-if="category">{{ category.name }}</h2>
          <h2 class="is-white" v-else>{{ title }}</h2>
        </div>
      </div>      
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<script lang="ts" setup>
const props = defineProps({
  category: {
    type: Object,
  },
  subCategories: {
    type: Object,
  },
  title: {
    type: String,
  }
})

const category = ref(props.category)

</script>
<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.title-bar
  background: linear-gradient(89.48deg, #91A80D 19.14%, #BAC323 42.28%, #9EA100 83.7%)
  height: 100px

 </style>