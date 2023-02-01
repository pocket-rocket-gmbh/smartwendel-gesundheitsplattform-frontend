<template>
  <div>
    <h1 class="is-primary">{{ careFacility.name }}</h1>
    <div v-if="careFacility.kind" class="text-info font-weight-bold">
      {{ useKindsCareFacilities().getNameFromId(careFacility.kind) }}
    </div>
    <div class="mt-4" v-html="careFacility.description"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    careFacility: {
      type: Object,
      required: true
    }
  }
})
</script>

<style lang="sass" scoped>
</style>