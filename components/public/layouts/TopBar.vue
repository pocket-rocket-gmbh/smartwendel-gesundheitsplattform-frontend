<template>
  <div>
    <v-app-bar class="hero-menu pa-3">
      <v-toolbar-title scroll-threshold="1" scroll-off-screen="true">
        <div class="d-flex align-center">
          <img @click="handleResetLink()" class="logo-header is-clickable" src="~/assets/images/logo.png" height="70" />
        </div>
      </v-toolbar-title>
      <div class="align-center d-none d-sm-flex">
        <div class="is-clickable d-flex"  v-for="(category, index) in categories" :key="index">
          <v-menu
            transition="scale-transition"
          >
            <template v-slot:activator="{ props }">
              <v-list-item-title  color="primary" v-bind="props">
                <div>
                  <span class="is-clickable mx-1" @click="setItemsAndGo(category, null)">
                  {{ category.name }}
                  </span>
                  <span>
                    <v-icon v-if="category.sub_categories.length > 0" class="mr-3">mdi-menu-down</v-icon>
                  </span>
                </div> 
              </v-list-item-title>
            </template>
            <v-list v-if="category.sub_categories.length > 0">
              <v-list-item>
                <div v-for="(sub_category, index) in category.sub_categories" :key="index" @click="setItemsAndGo(category, sub_category)">
                  <v-list v-if="sub_category && sub_category.sub_sub_categories.length > 0">
                    <v-list-item>
                      <span class="is-clickable" >
                        {{ sub_category.name }}
                      </span>
                    </v-list-item>
                  </v-list>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <router-link class="mr-6 menu-list" to="/login" v-if="!useUser().loggedIn()">Login / Registrieren</router-link>
        <span class="is-clickable menu-list" v-if="!useUser().loggedIn()" @click="emitSetTutorial()">Tutorial</span>
        <v-divider class="divider" :thickness="3" vertical color="blue" opacity="1"></v-divider>
        <router-link class="mx-3 menu-list" to="/admin" v-if="useUser().isAdmin()">Dashboard</router-link>
        <PublicLayoutsMiniMenu
          :current-user="currentUser"
          :user-is-admin="userIsAdmin"
        />
      </div>
      <div class="d-flex d-sm-none align-center" align="center">
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
        />
        <NotificationsMenu v-if="currentUser" />
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
          <div v-if="!useUser().loggedIn()" class="mb-5">
            <v-icon class="mr-2">mdi-login</v-icon>
            <router-link class="mr-6" to="/login">Login / Registrieren</router-link>
          </div>
          <div v-if="!useUser().loggedIn()" class="mb-5">
            <v-icon class="mr-2">mdi-note-check-outline</v-icon>
            <router-link class="mr-6" to="/terms_of_use">Nutzungsbedingungen</router-link>
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
              <router-link class="mr-6" to="/admin">Dashboard</router-link>
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
  </div>

    
</template>

<script lang="ts">
import { useUserStore } from "@/store/user"
export default defineComponent({
  setup() {
    const currentUser = ref(null)
    const router = useRouter()
    const categories = ref([])
    const sub_categoryId = ref ({})
    const drawer = ref(false)
    const menu = ref(false)

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePublicApi())
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

    const setItemsAndGo = (category:any, sub_category:any) => {
      if (category.sub_categories.length > 0) {
        router.push({path: `/public/categories/${category.id}`, query: { sub_category_id: sub_category.id }})
        if(sub_category.id) {
          sub_categoryId.value = sub_category.id
        }
      } else {
        router.push({path: `/public/categories/${category.id}`, query: null})
      }
      useNuxtApp().$bus.$emit('setSubCategory', sub_category.id)
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
      if (useUserStore().currentUser) {
        currentUser.value = useUserStore().currentUser
      }
      getCategories()
    })
    // watch store changes
    useUserStore().$subscribe((mutation, state) => {
      currentUser.value = state.currentUser
    })
    return {
      handleResetLink,
      menu,
      currentUser,
      drawer,
      categories,
      userIsAdmin,
      reload,
      setItemsAndGo,
      sub_categoryId
    }
  }
})
</script>

<style lang="sass">
.v-toolbar
  background: white

.hero
  background: linear-gradient(270deg, #017DC2 0.29%, #015281 100%)
  height: 100%

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
  color: #015281

.mobile-logo-height
  max-height: 40px

.desktop-logo-height
  max-height: 50px

</style>