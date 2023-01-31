<template>
  <v-app-bar
    prominent 
    class="hero-menu"
    dense
    fixed
    height="80"
    >
    <v-toolbar-title scroll-threshold="1" scroll-off-screen="true">
      <img @click="handleResetLink" class="logo-header is-clickable" src="@/assets/images/logo.png" height="50" />
    </v-toolbar-title>
    <div class="align-center d-none d-sm-flex">
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
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '~~/store/user'

export default defineComponent({
  setup () {
    const userStore = useUserStore()
    const router = useRouter()
    const handleResetLink = () => {
      if (router.currentRoute.value.path === '/') {
        location.reload()
      } else {
        router.push({ path: '/' })
      }
    }
    return {
      userStore,
      handleResetLink
    }
  }
})
</script>

<style lang="sass" scoped>

</style>