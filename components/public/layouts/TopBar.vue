<template>
        <v-app-bar class="hero-menu pa-3">
          {{ sub_categoryId.name }}
          <v-toolbar-title scroll-threshold="1" scroll-off-screen="true">
            <div class="d-flex">
              <img @click="handleResetLink()" class="logo-header is-clickable" src="~/assets/images/logo.png" height="90" />
            </div>
          </v-toolbar-title>
          <div class="is-clickable d-flex"  v-for="(category, index) in categories" :key="index">
            <v-menu
              transition="scale-transition"
            >
              <template v-slot:activator="{ props }">
                <v-list-item-title  color="primary" v-bind="props">
                  <div class="is-clickable mx-1">
                    <span>
                    {{ category.name }}
                    </span>
                    <span>
                      <v-icon class="mr-3">mdi-menu-down</v-icon>
                    </span>
                  </div> 
                </v-list-item-title>
              </template>
              <v-list>
                <v-list-item>
                  <div v-for="(sub_category, index) in category.sub_categories" :key="index" @click="setItemsAndGo(category, sub_category)">{{ sub_category.name }}</div>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <div class="align-center d-none d-sm-flex">
            <router-link class="mx-3 menu-list" to="/admin" v-if="userIsAdmin">Projekte verwalten</router-link>
            <v-divider v-if="!currentUser" class="divider" :thickness="3" vertical color="blue" opacity="1"></v-divider>
            <router-link class="mx-3 menu-list" to="/login" v-if="!currentUser">Login / Registrieren</router-link>
            <v-divider v-if="currentUser" class="divider" :thickness="3" vertical color="blue" opacity="1"></v-divider>
            <PublicMiniMenu
              :current-user="currentUser"
              :user-is-admin="userIsAdmin"
            />
          </div>
          <div class="d-flex d-sm-none align-center" align="center">
            <v-app-bar-nav-icon
              @click="drawer = !drawer"
            />
          </div>
        </v-app-bar>
        <v-navigation-drawer
          class="d-flex d-sm-none"
          v-model="drawer"
          fixed
          temporary
          >
          <v-list
            nav
            flat
          >
          <v-list-item-group>
            <v-list class="my-10">
              <div class="d-inline-flex" v-if="currentUser">
                <img
                  v-if="currentUser.image_url"
                  :src="currentUser.image_url"
                  class="is-rounded"
                  height="60"
                />
                <img
                  v-if="!currentUser.image_url"
                  src="~/assets/images/user-standard.png"
                  class="is-rounded"
                  height="60"
                />
                <v-list-item v-if="currentUser">
                <v-list-item-title>{{currentUser.name}}</v-list-item-title>
                <v-list-item-subtitle>{{currentUser.role}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{currentUser.email}}</v-list-item-subtitle>
                </v-list-item>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
              >
              </v-menu>
              </div>
              <div v-if="!userStore.loggedIn" class="mb-5">
                <v-icon class="mr-2">mdi-login</v-icon>
                <router-link class="mr-6" to="/login">Login / Registrieren</router-link>
              </div>
            <template v-slot:activator="{ props }">
              <div class="account-button"
                v-bind="props"
              >
                <p class="mr-2 menu-list">Mein Account</p>
                <UserProfile
                  :user="currentUser"
                />
              </div>
              </template>
              <v-divider v-if="userIsAdmin" class="my-5"></v-divider>
                <v-list-item v-if="userIsAdmin">
                  <router-link class="mr-6" to="/admin">Projekte verwalten</router-link>
                </v-list-item>
              <v-divider v-if="currentUser" class="my-5"></v-divider>
                <v-list-item v-if="currentUser">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  <router-link :to="`/public/users/${currentUser.id}`">Konto verwalten</router-link>
                </v-list-item>
                <v-list-item v-if="currentUser && userIsAdmin">
                  <v-icon class="mr-2">mdi-note-check-outline</v-icon>
                  <router-link to="/terms_of_use">Nutzungsbedingungen</router-link>
                </v-list-item>
                <v-list-item v-if="currentUser">
                  <v-icon class="mr-2">mdi-logout</v-icon>
                  <span class="is-clickable" @click="useUser().logout(), drawer = !drawer, reload();"><span>Logout</span></span>
                </v-list-item>
              </v-list>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
 
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from "@/store/user"
export default defineComponent({
  setup(props) {
    const currentUser = ref(null)
    const userStore = useUserStore()
    const router = useRouter()
    const drawer = ref(false)
    const menu = ref(false)
    const categories = ref([])
    const sub_categoryId = ref ({})

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePrivateApi())
    categoriesApi.setEndpoint(`categories`)

    const getCategories = async () => {
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await categoriesApi.retrieveCollection(options)
      categories.value = categoriesApi.items.value
    }

    const handleResetLink = () => {
      if (router.currentRoute.value.path === '/') {
        location.reload()
      } else {
        router.push({ path: '/' })
      }
    }
    const setItemsAndGo = (category, sub_category) => {
      router.push({path: `/public/categories/${category.id}`, query: { sub_category_id: sub_category.id }})
      sub_categoryId.value = sub_category.id
    }


    const userIsAdmin = computed(() => {
      if (currentUser.value) {
        return currentUser.value.role === 'root' || currentUser.value.role === 'admin'
      }
      return false
    })


    const reload = () => {
      router.push({ path: '/' })
    }

    onMounted(() => {
      getCategories()

    })


    // watch store changes
    useUserStore().$subscribe((mutation, state) => {
      currentUser.value = state.currentUser
    })
    return {
      handleResetLink,
      menu,
      categories,
      currentUser,
      userStore,
      drawer,
      userIsAdmin,
      reload,
      setItemsAndGo,
      sub_categoryId
    }
  }
})
</script>

<style lang="sass" scoped>

.logo-header
  padding: 10px

.my-account
  background-color: #F5F5F5

.account-button
  display: flex
  align-content: center
  align-items: center
  cursor: pointer

.card-header
  margin-left: 30px
  flex-direction: row
  align-items: center

.divider
  color: white


</style>