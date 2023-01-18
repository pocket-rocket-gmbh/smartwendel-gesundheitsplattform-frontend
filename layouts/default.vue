<template>
  <v-app>
    <PublicLayoutsTopBar />
    <PublicLayoutsSecondBar />

    <v-main>
      <slot />
    </v-main>
    <PublicLayoutsFooter />
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>

<style lang="sass" scoped>

</style>