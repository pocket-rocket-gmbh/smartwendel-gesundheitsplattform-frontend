<template>
  <v-app-bar
    density="compact"
    :flat="true"
    color="primary"
    class="navigation top-bar"
  >
    <v-spacer></v-spacer>
    <v-list-item>
      <router-link class="mr-4" to="/">Impressum</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Newsletter</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/">Kontakt</router-link>
    </v-list-item>
    <v-list-item>
      <router-link class="mr-4" to="/login">Login</router-link>
    </v-list-item>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
})
</script>

<style lang="sass" scoped>

</style>