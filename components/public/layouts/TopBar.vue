<template>
  <div class="main">
    <v-app-bar v-model="appStore.showTopbar" :elevation="2" class="hero-menu">
      <v-app-bar-title>
        <div class="d-flex align-center">
          <div class="d-flex align-center">
            <a href="/" class="d-flex align-center">
              <img src="~/assets/images/logo.png" class="is-clickable" width="200" />
            </a>
          </div>
          <div v-if="breakPoints.width.value >= 1400" class="align-center d-flex mx-2">
            <div class="categories-wrapper is-clickable d-flex" v-for="(category, index) in categories" :key="index">
              <div class="title mx-5">
                <span class="is-clickable main" @click="setItemsAndGo(category, null)">
                  {{ category.name }}
                </span>
              </div>
              <div class="content">
                <v-list>
                  <v-list-item>
                    <div v-for="(sub_category, index) in subCategories[category.id]" :key="sub_category.id" @click="setItemsAndGo(category, sub_category)">
                      <div class="list-item main">
                        <div>
                          <span class="is-clickable main">
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
              <span href="/public/search/facilities" class="is-clickable mx-5" @click.prevent="goTo('/public/search/facilities')"> Anbieter </span>
              <span href="/public/search/courses" class="is-clickable mx-5" @click.prevent="goTo('/public/search/courses')"> Kurse </span>
              <span href="/public/search/events" class="is-clickable mx-5" @click.prevent="goTo('/public/search/events')"> Veranstaltungen </span>
            </div>
          </div>
        </div>
      </v-app-bar-title>
      <div class="align-center d-flex" v-if="breakPoints.width.value >= 1400 && !loading">
        <div class="has-bg-primary mr-5 text-white offer py-1" v-if="!useUser().loggedIn() && currentRoute !== '/register'">
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
        <div class="d-flex align-center main">
          <span class="mx-3 menu-list pointer" v-if="useUser().isAdmin()" href="/admin" @click.prevent="saveCurrentUrlAndRoute('/admin')"> Admin-Bereich </span>
          <span
            class="mx-3 menu-list pointer"
            v-else-if="useUser().isFacilityOwner()"
            href="/admin/care_facilities"
            @click.prevent="saveCurrentUrlAndRoute('/admin/care_facilities')"
          >
            Meine Einrichtung
          </span>
          <PublicLayoutsMiniMenu :current-user="currentUser" :user-is-admin="userIsAdmin" />
        </div>
      </div>
      <div v-if="breakPoints.width.value < 1400" class="d-flex align-center" align="center">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </div>
    </v-app-bar>
    <v-navigation-drawer class="d-flex" v-model="drawer" fixed temporary>
      <div class="navigation-drawer-content">
        <div class="has-bg-primary text-white offer d-flex align-center justify-center py-2" v-if="!useUser().loggedIn() && currentRoute !== '/register'">
          <div @click="goToRegister()">
            <div class="font-weight-bold">Dein Angebot fehlt?</div>
            <div class="font-weight-light">Registriere dich!</div>
          </div>
        </div>
        <v-btn v-if="!useUser().loggedIn()" color="primary" @click="goToLogin"> Einloggen </v-btn>
        <div v-if="useUser().loggedIn() && currentUser" class="d-flex">
          <img v-if="currentUser.image_url" :src="currentUser.image_url" class="is-rounded" height="60" />
          <img v-if="!currentUser.image_url" src="~/assets/images/user-standard.png" class="is-rounded" height="60" />
          <v-list-item v-if="currentUser">
            <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ currentUser.role }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
          </v-list-item>
        </div>
        <div class="logged-in-actions">
          <span class="menu-list pointer" v-if="useUser().isAdmin()" href="/admin" @click.prevent="saveCurrentUrlAndRoute('/admin')">
            <v-icon class="mr-2">mdi-cog</v-icon>
            <span>Admin-Bereich</span>
          </span>
          <span
            class="menu-list pointer"
            v-else-if="useUser().isFacilityOwner()"
            href="/admin/care_facilities"
            @click.prevent="saveCurrentUrlAndRoute('/admin/care_facilities')"
          >
            Meine Einrichtung
          </span>
          <div v-if="useUser().currentUser" @click="useUser().logout(), (drawer = !drawer), reload()">
            <v-icon class="mr-2">mdi-logout</v-icon>
            <span>Logout</span>
          </div>
        </div>

        <v-divider></v-divider>
        <div>
          <v-icon class="mr-2">mdi-note-check-outline</v-icon>
          <span class="mr-6" href="/rules_of_conduct">Nutzungsbedingungen</span>
        </div>
        <v-divider></v-divider>

        <div class="categories-wrapper is-clickable d-flex" v-for="(category, index) in categories" :key="index">
          <div class="title">
            <span class="is-clickable main" @click="setItemsAndGo(category, null)">
              {{ category.name }}
            </span>
          </div>
        </div>
        <template v-if="!loading" class="main">
          
          <span href="/public/search/facilities" class="is-clickable" @click.prevent="goTo('/public/search/facilities')"> Anbieter </span>
          <span href="/public/search/courses" class="is-clickable" @click.prevent="goTo('/public/search/courses')"> Kurse </span>
          <span href="/public/search/events" class="is-clickable" @click.prevent="goTo('/public/search/events')"> Veranstaltungen </span>
        </template>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { useFilterStore } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";
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
const filterStore = useFilterStore();
const breakPoints = useBreakpoints();

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
  filterStore.currentSearchTerm = "";
  router.push({ path });
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
    return currentUser.value.role === "root" || currentUser.value.role === "admin" || currentUser.value.role === "care_facility_admin";
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

<style lang="scss">
@import "@/assets/sass/main";

header,
.v-toolbar-title__placeholder {
  overflow: visible !important;
}
.hero-menu {
  padding: 0.75rem 5rem;
  --v-scrollbar-offset: 5rem;

  @include md {
    max-width: 100vw;
    --v-scrollbar-offset: 0;
  }
}
.pointer {
  cursor: pointer;
}
.v-toolbar__title {
  font-size: 1.5rem !important;
}
.v-toolbar {
  background: white;
  @include md {
    padding: 0;
  }
}
.v-toolbar__content {
  .v-toolbar-title {
    margin-inline-start: 0;
  }
  @include md {
    padding: 1rem;
  }
}
.hero {
  background: linear-gradient(270deg, #017dc2 0.29%, #015281 100%);
  height: 100%;
}
.my-account {
  background-color: #f5f5f5;
}
.account-button {
  display: flex;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
.card-header {
  margin-left: 30px;
  flex-direction: row;
  align-items: center;
}
.divider {
  color: #015281;
}
.mobile-logo-height {
  max-height: 40px;
}
.desktop-logo-height {
  max-height: 50px;
}
.main {
  font-size: 1.2rem !important;
}
.offer {
  border-radius: 20px;
  line-height: 1.5rem;
  font-size: 16px;
}
.categories-wrapper {
  position: relative;

  &:hover .content {
    opacity: 1;
    transform: scale(1);
    pointer-events: all;
  }
  .title {
    position: relative;
  }
  .content {
    border-radius: 0.25rem;
    overflow: hidden;
    position: absolute;
    opacity: 0;
    transform: scale(0);
    transform-origin: top left;
    transition: transform 200ms ease-in-out, opacity 200ms;
    pointer-events: none;
    z-index: 5;
    top: 100%;
    width: 100%;
    box-shadow: 0px 5px 10px rgba(black, 0.5);

    .list-item {
      padding: 0.75rem 1rem;

      &:hover {
        background: #f2f2f2;
      }
    }
  }
}

.navigation-drawer-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  margin-top: 2rem;

  @include md {
    margin-top: 0;
  }

  .logged-in-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
