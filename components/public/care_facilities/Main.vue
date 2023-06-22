<template>
  <div>
    <h1 class="is-dark-grey">{{ careFacility.name }}</h1>
   <div class="mt-4 facility-description" v-html="careFacility.description"></div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    careFacility: {
      type: Object,
      required: true
    }
  })
</script>

<style lang="sass" scoped>
  @import "@/assets/sass/main.sass"

</style>