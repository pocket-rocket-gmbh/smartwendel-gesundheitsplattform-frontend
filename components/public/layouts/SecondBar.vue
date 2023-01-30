<template>


  <v-app-bar
    density="compact"
    :flat="true"
    class="navigation top-bar"
  >
    <v-spacer></v-spacer>
    <v-list-item>
      <router-link class="mr-4" to="/">Pflegeeinrichtungen</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Gesundheit & Prävention</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Informationen</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Neuigkeiten</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Über uns</router-link>
    </v-list-item>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>

<style lang="sass" scoped>
.navigation.top-bar
  background: linear-gradient(270deg, #017DC2 0.29%, #015281 100%)
</style>