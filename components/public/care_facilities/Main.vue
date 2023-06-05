<template>
  <div>
    <h1 class="is-dark-grey">{{ careFacility.name }}</h1>
    <div v-if="careFacility.kind" class="is-primary font-weight-bold">
      {{ useKindsCareFacilities().getNameFromId(careFacility.kind) }}
    </div>
    <div class="mt-4" v-html="careFacility.description"></div>
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
</style>