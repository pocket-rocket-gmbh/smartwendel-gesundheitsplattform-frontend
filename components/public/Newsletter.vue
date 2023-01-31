<template>
  <div class="newsletter">
    <v-text-field
      hide-details="auto"
      variant="plain"
      density="compact"
      class="input-field pl-2"
      clear-icon="mdi-close-circle"
      clearable
      append-icon="mdi-send"
      :error-messages="useErrors().checkAndMapErrors('email', errors)"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup () {
      const errors = ref([])

    return {
      errors
    }
  }
})
</script>
<style style lang="sass" scoped>

.input-field
  border: 2px solid white
  border-radius: 25px

.newsletter
  display: flex
  outline: none

</style>