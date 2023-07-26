<template>
  <div class="main">
    <v-app-bar scroll-behavior="hide" :elevation="2" class="hero-menu pa-3 px-10">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <img @click="handleResetLink()" class="is-clickable" src="~/assets/images/logo.png" width="200" />
          <div class="align-center d-none d-sm-flex mx-2">
            <div class="is-clickable d-flex" v-for="(category, index) in categories" :key="index">
              <v-menu
              open-on-hover
                transition="scale-transition"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item-title  color="primary" v-bind="props">
                    <div class="mx-5">
                      <span class="is-clickable main" @click="setItemsAndGo(category, null)">
                      {{ category.name }}
                      </span>
                    </div> 
                  </v-list-item-title>
                </template>
                <v-list v-if="category.sub_categories.length > 0">
                  <v-list-item >
                    <div v-for="(sub_category, index) in subCategories[category.id]" :key="index" @click="setItemsAndGo(category, sub_category)">
                      <v-list class="pa-0 main" v-if="sub_category && sub_category.sub_sub_categories.length > 0">
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
            <div>
        </div>
          <a href="/public/search/facilities" class="is-clickable mx-5">
              Anbieter
          </a>
          
          <a href="/public/search/events" class="is-clickable mx-5">
              Kurse
          </a>
          <a href="/public/search/news" class="is-clickable mx-5">
              Beiträge
          </a>
        </div>
        </div>
      </v-app-bar-title>
      <div class="align-center d-none d-sm-flex">
        <div class="has-bg-primary mr-5 text-white offer py-1" v-if="!useUser().loggedIn() && currentRoute !== '/register'">
          <v-row class="mx-1 text-center">
            <v-col class="flex-column align-center is-clickable" @click="goToRegister()">
              <div class="font-weight-bold">Dein Angebot fehlt?</div>
              <div class="font-weight-light">Registriere dich!</div>
            </v-col>
          </v-row>
        </div>
          <div>
            <v-btn
              v-if="!useUser().loggedIn()"
              href="/login"
              color="primary"
              icon
                >
                <v-icon size="x-large">mdi-account-circle-outline</v-icon>
            </v-btn>
          </div>
        <a
          class="mx-3 menu-list pointer"
          v-if="useUser().isAdmin()"
          href="/admin"
          @click.prevent="saveCurrentUrlAndRoute('/admin')"
        >
          Admin-Bereich
        </a>
        <a
          class="mx-3 menu-list pointer"
          v-else-if="useUser().isFacilityOwner()"
          href="/admin/care_facilities"
          @click.prevent="saveCurrentUrlAndRoute('/admin/care_facilities')"
        >
          Meine Einrichtungen
        </a>
        <PublicLayoutsMiniMenu
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
              <router-link class="mr-6" to="/admin">Admin-Bereich</router-link>
            </v-list-item>
          <v-divider v-if="currentUser" class="my-5"></v-divider>
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
import { useAppStore } from "@/store/app"

export default defineComponent({
  setup() {
    const currentUser = ref(null)
    const router = useRouter()
    const categories = ref([])
    const subCategories = ref({})
    const sub_categoryId = ref ({})
    const drawer = ref(false)
    const menu = ref(false)
    const appStore = useAppStore();
    const route = useRoute()
    const loading = ref(false)

    const categoriesApi = useCollectionApi()
    categoriesApi.setBaseApi(usePublicApi())

    const getCategories = async () => {
      loading.value = true
      categoriesApi.setEndpoint(`categories`)
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await categoriesApi.retrieveCollection(options)
      categories.value = categoriesApi.items.value
      loading.value = false
    }
    const getSubCategories = async (categoryId: string) => {
      categoriesApi.setEndpoint(`categories/${categoryId}/sub_categories`)
      const options = { page: 1, per_page: 25, sort_by: 'menu_order', sort_order: 'ASC', searchQuery: null, concat: false, filters: [] }
      await categoriesApi.retrieveCollection(options)
      return categoriesApi.items.value
    }

    const handleResetLink = () => {
      if (router.currentRoute.value.path === '/') {
        location.reload()
      } else {
        router.push({ path: '/' })
      }
    }

    const currentRoute = computed(() => {
      return route.path as string
    })

    const goToRegister = () => {
      router.push({ path: '/register' })
    }

    const setItemsAndGo = (category:any, sub_category:any) => {
      if (sub_category ) {
        router.push({path: `/public/categories/${category.id}`, query: { sub_category_id: sub_category.id }})
        if(sub_category.id) {
          sub_categoryId.value = sub_category.id
        }
      } else {
       return router.push({path: `/public/categories/${category.id}`, query: null})
      }
      useNuxtApp().$bus.$emit('setSubCategory', sub_category.id)
    }

    const userIsAdmin = computed(() => {
      if (currentUser.value) {
        return currentUser.value.role === 'root' || currentUser.value.role === 'admin' || currentUser.value.role === 'care_facility_admin'
      }
      return false
    })

    const reload = () => {
      router.push({ path: '/' })
    }

    onMounted(async () => {
      if (useUserStore().currentUser) {
        currentUser.value = useUserStore().currentUser
      }
      await getCategories()
      for (const category of categories.value) {
        // @ts-expect-error no type
        subCategories.value[category.id] = await getSubCategories(category.id)
        
      }
    })
    // watch store changes
    useUserStore().$subscribe((mutation, state) => {
      currentUser.value = state.currentUser
    })

    const saveCurrentUrlAndRoute = (routeTo: string) => {
      appStore.dashboardBackLink = window.location.pathname;

      router.push({ path: routeTo });
    }

    return {
      handleResetLink,
      menu,
      currentUser,
      drawer,
      categories,
      userIsAdmin,
      reload,
      setItemsAndGo,
      sub_categoryId,
      goToRegister,
      saveCurrentUrlAndRoute,
      subCategories,
      currentRoute,
      loading
    }
  }
})
</script>

<style lang="sass">

.pointer
  cursor: pointer

.v-toolbar__title
  font-size: 1.5rem !important

.v-toolbar
  background: white

.hero
  background: linear-gradient(270deg, #017DC2 0.29%, #015281 100%)
  height: 100%

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

.main
  font-size: 1.2rem!important

.offer
  border-radius: 20px
  line-height: 1.5rem
  font-size: 16px

</style>