<template>
  <v-app-bar
    density="compact"
    :flat="true"
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
      <router-link class="mr-4" to="/admin" v-if="userStore.loggedIn">Adminbereich</router-link>
      <router-link class="mr-4" to="/login" v-else>Login</router-link>
    </v-list-item>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '~~/store/user'
export default defineComponent({
  setup () {
    const userStore = useUserStore()
    return {
      userStore
    }
  }
})
</script>

<style lang="sass" scoped>
.navigation.top-bar
  background: linear-gradient(270deg, #017DC2 0.29%, #015281 100%)
</style>