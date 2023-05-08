<template>
  <div>
    <v-menu v-if="currentUser"
    v-model="menu"
    :close-on-content-click="false"
    >
      <template v-slot:activator="{ props }">
        <div class="account-button"
          v-bind="props"
        >
          <p class="mx-5 menu-list">Mein Account</p>
          <div v-if="currentUser">
            <UserProfile
              :user="currentUser"
            />
          </div>
        </div>
      </template>
      <v-card class="mx-auto ma-2" width="300" v-if="currentUser">
        <v-list class="card-header">
          <v-list-item-content >
            <v-list-item-title>{{currentUser}}</v-list-item-title>
            <v-list-item-subtitle>{{currentUser.role}}</v-list-item-subtitle>
            <v-list-item-subtitle>{{currentUser.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list>
        <v-divider></v-divider>
        <v-list>
          <v-list-item class="is-clicable" v-if="currentUser" @click="closeMenuAndRouteTo(`/public/users/${currentUser.id}`)">
            <v-icon class="mr-2">mdi-account</v-icon>
            Konto verwalten
          </v-list-item>
          <v-list-item class="is-clicable" v-if="currentUser" @click="closeMenuAndRouteTo(`/public/users/trophies`)">
            <v-icon class="mr-2">mdi-trophy</v-icon>
            Erfolge
          </v-list-item>
          <v-list-item class="is-clicable" v-if="useUser().isAdmin()" @click="closeMenuAndRouteTo(`/admin`)">
            <v-icon class="mr-2">mdi-cog</v-icon>
            Admin
          </v-list-item>
          <v-list-item class="is-clicable" @click="closeMenuAndRouteTo(`/public/pinboards/`)">
            <v-icon class="mr-2">mdi-lightbulb-on-outline</v-icon>
            Ideenpinnwand
          </v-list-item>
          <v-list-item class="is-clicable" @click="closeMenuAndRouteTo(`/terms_of_use`)">
            <v-icon class="mr-2">mdi-note-check-outline</v-icon>
            Nutzungsbedingungen
          </v-list-item>
          <v-list-item class="is-clicable" v-if="currentUser" @click="useUser().logout(); reload();">
            <v-icon class="mr-2">mdi-logout</v-icon>
            Logout
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="closeMenuAndRouteTo(``)"
          >
          schließen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: 'miniMenu',
  props: {
    currentUser: {
      required: true
    },
    userIsAdmin: {
      type: Boolean
    }
  },
  setup() {
    const router = useRouter()
    const menu = ref(false)

    const reload = () => {
      router.push({ path: '/' })
    }

    const handleResetLink = () => {
      if (router.currentRoute.value.path === '/') {
        location.reload()
      } else {
        router.push({ path: '/' })
      }
    }

    const closeMenuAndRouteTo = (route: string) => {
      menu.value = false;
      router.push(route);
    }

    return {
      handleResetLink,
      menu,
      reload,
      closeMenuAndRouteTo
    }
  }
})
</script>

<style lang="sass">
.account-button
  display: flex
  align-content: center
  align-items: center
  cursor: pointer

.card-header
  margin-left: 30px
  flex-direction: row
  align-items: center

</style>