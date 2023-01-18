<template>
  <div>
    <h1 class="is-primary">{{ careFacility.name }}</h1>
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