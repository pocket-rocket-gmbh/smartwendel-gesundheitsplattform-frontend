<template>
  <v-dialog
    v-model="open"
    :scrim="false"
    width="200"
    persistent
  >
    <v-card
      color="primary"
    >
      <v-card-text>
        Bitte warten
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const open = ref(true)
    return {
      open
    }
  }
})
</script>

<style lang="sass" scoped>

</style>