<template>
  <div class="main">
    <v-app-bar v-model="appStore.showTopbar" :elevation="2" class="hero-menu">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <img @click="handleResetLink()" class="is-clickable" src="~/assets/images/logo.png" width="200" />
          <div class="align-center d-none d-sm-flex mx-2">
            <div class="categories-wrapper is-clickable d-flex" v-for="(category, index) in categories" :key="index">
              <div class="title mx-5">
                <span class="is-clickable main" @click="setItemsAndGo(category, null)">
                  {{ category.name }}
                </span>
              </div>
              <div class="content">
                <v-list v-if="category.sub_categories.length > 0">
                  <v-list-item>
                    <div
                      v-for="(sub_category, index) in subCategories[category.id]"
                      :key="sub_category.id"
                      @click="setItemsAndGo(category, sub_category)"
                    >
                      <div class="list-item main" v-if="sub_category && sub_category.sub_sub_categories.length > 0">
                        <div>
                          <span class="is-clickable">
                            {{ sub_category.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </v-list-item>
                </v-list>
              </div>
            </div>
            <div v-if="!loading">
              <a
                href="/public/search/facilities"
                class="is-clickable mx-5"
                @click.prevent="goTo('/public/search/facilities')"
              >
                Anbieter
              </a>
              <a href="/public/search/events" class="is-clickable mx-5" @click.prevent="goTo('/public/search/events')">
                Kurse
              </a>
              <a href="/public/search/news" class="is-clickable mx-5" @click.prevent="goTo('/public/search/news')">
                Beiträge
              </a>
            </div>
          </div>
        </div>
      </v-app-bar-title>
      <div class="align-center d-none d-sm-flex" v-if="!loading">
        <div
          class="has-bg-primary mr-5 text-white offer py-1"
          v-if="!useUser().loggedIn() && currentRoute !== '/register'"
        >
          <v-row class="mx-1 text-center">
            <v-col class="flex-column align-center is-clickable" @click="goToRegister()">
              <div class="font-weight-bold">Dein Angebot fehlt?</div>
              <div class="font-weight-light">Registriere dich!</div>
            </v-col>
          </v-row>
        </div>
        <div>
          <v-btn v-if="!useUser().loggedIn()" color="primary" icon @click="goToLogin">
            <v-icon size="x-large">mdi-account-circle-outline</v-icon>
          </v-btn>
        </div>
        <div class="d-flex align-center">
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
          <PublicLayoutsMiniMenu :current-user="currentUser" :user-is-admin="userIsAdmin" />
        </div>
      </div>
      <div class="d-flex d-sm-none align-center" align="center">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </div>
    </v-app-bar>
    <v-navigation-drawer class="d-flex d-sm-none" v-model="drawer" fixed temporary>
      <v-list nav flat>
        <v-list-item-group>
          <v-list class="my-10">
            <div class="d-inline-flex" v-if="currentUser">
              <img v-if="currentUser.image_url" :src="currentUser.image_url" class="is-rounded" height="60" />
              <img
                v-if="!currentUser.image_url"
                src="~/assets/images/user-standard.png"
                class="is-rounded"
                height="60"
              />
              <v-list-item v-if="currentUser">
                <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ currentUser.role }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-menu v-model="menu" :close-on-content-click="false"> </v-menu>
            </div>
            <div v-if="!useUser().loggedIn()" class="mb-5">
              <v-icon class="mr-2">mdi-note-check-outline</v-icon>
              <router-link class="mr-6" to="/terms_of_use">Nutzungsbedingungen</router-link>
            </div>
            <template v-slot:activator="{ props }">
              <div class="account-button" v-bind="props">
                <p class="mr-2 menu-list">Mein Account</p>
                <UserProfile :user="currentUser" />
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
              <span class="is-clickable" @click="useUser().logout(), (drawer = !drawer), reload()"
                ><span>Logout</span></span
              >
            </v-list-item>
          </v-list>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
const currentUser = ref(null);
const router = useRouter();
const categories = ref([]);
const subCategories = ref<any>({});
const sub_categoryId = ref({});
const drawer = ref(false);
const menu = ref(false);
const appStore = useAppStore();
const route = useRoute();
const loading = ref(true);

const categoriesApi = useCollectionApi();
categoriesApi.setBaseApi(usePublicApi());

const getCategories = async () => {
  loading.value = true;
  categoriesApi.setEndpoint(`categories`);
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };
  await categoriesApi.retrieveCollection(options);
  categories.value = categoriesApi.items.value;
  loading.value = false;
};

const getSubCategories = async (categoryId: string) => {
  categoriesApi.setEndpoint(`categories/${categoryId}/sub_categories`);
  const options = {
    page: 1,
    per_page: 25,
    sort_by: "menu_order",
    sort_order: "ASC",
    searchQuery: null as any,
    concat: false,
    filters: [] as any,
  };
  await categoriesApi.retrieveCollection(options);
  return categoriesApi.items.value;
};

const goToLogin = () => {
  router.push({ path: "/login" });
};

const goTo = (path: string) => {
  router.push({ path });
};

const handleResetLink = () => {
  if (router.currentRoute.value.path === "/") {
    location.reload();
  } else {
    router.push({ path: "/" });
  }
};

const currentRoute = computed(() => {
  return route.path as string;
});

const goToRegister = () => {
  router.push({ path: "/register" });
};

const setItemsAndGo = (category: any, sub_category: any) => {
  if (sub_category) {
    router.push({
      path: `/public/categories/${category.id}`,
      query: { sub_category_id: sub_category.id },
    });
    if (sub_category.id) {
      sub_categoryId.value = sub_category.id;
    }
  } else {
    return router.push({
      path: `/public/categories/${category.id}`,
      query: null,
    });
  }
  useNuxtApp().$bus.$emit("setSubCategory", sub_category.id);
};

const userIsAdmin = computed(() => {
  if (currentUser.value) {
    return (
      currentUser.value.role === "root" ||
      currentUser.value.role === "admin" ||
      currentUser.value.role === "care_facility_admin"
    );
  }
  return false;
});

const reload = () => {
  router.push({ path: "/" });
};

onMounted(async () => {
  if (useUserStore().currentUser) {
    currentUser.value = useUserStore().currentUser;
  }
  await getCategories();
  for (const category of categories.value) {
    subCategories.value[category.id] = await getSubCategories(category.id);
  }
});
// watch store changes
useUserStore().$subscribe((mutation, state) => {
  currentUser.value = state.currentUser;
});

const saveCurrentUrlAndRoute = (routeTo: string) => {
  appStore.dashboardBackLink = window.location.pathname;

  router.push({ path: routeTo });
};
</script>

<style lang="sass">
@import "@/assets/sass/main"

header, .v-toolbar-title__placeholder
  overflow: visible !important

.hero-menu
  @include md
    max-width: 100vw

.pointer
  cursor: pointer

.v-toolbar__title
  font-size: 1.5rem !important

.v-toolbar
  background: white
  @include md
    padding: 0

.v-toolbar__content
  @include md
    padding: 0.5rem

    .v-toolbar-title
      margin-inline-start: 0


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

.categories-wrapper
  position: relative

  &:hover .content
    opacity: 1
    transform: scale(1)
    pointer-events: all

  .title
    position: relative

  .content
    border-radius: 0.25rem
    overflow: hidden
    position: absolute
    opacity: 0
    transform: scale(0)
    transform-origin: top left
    transition: transform 200ms ease-in-out, opacity 200ms
    pointer-events: none
    z-index: 5
    top: 100%
    width: 100%
    box-shadow: 0px 5px 10px rgba(black, 0.5)

    .list-item
      padding: 0.75rem 1rem

      &:hover
        background: #f2f2f2
</style>
