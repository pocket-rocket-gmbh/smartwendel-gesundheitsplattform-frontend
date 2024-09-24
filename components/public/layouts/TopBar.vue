<template>
  <div class="main">
    <v-app-bar
      v-model="appStore.showTopbar"
      :elevation="5"
      class="hero-menu"
      :class="{ 'py-2': appStore.showTopbar }"
    >
      <v-app-bar-title>
        <div class="d-flex align-center">
          <div class="d-flex align-center">
            <a
              href="/"
              @click.prevent="navigateTo('/')"
              class="d-flex align-center"
            >
              <img
                src="~/assets/images/logo.png"
                class="is-clickable"
                :width="breakPoints.width.value <= 380 ? '130' : '200'"
              />
            </a>
          </div>
          <div
            v-if="breakPoints.width.value >= 1460"
            class="align-center d-flex mx-2"
          >
            <div
              class="categories-wrapper is-clickable d-flex"
              v-for="(category, index) in categories"
              :key="index"
            >
              <div class="mx-5 font-weight-medium">
                <a
                  :href="getItemsAndGo(category, null)"
                  class="is-clickable general-font-size is-dark-grey"
                  :class="[currentRoute.includes(currentCategory?.id) && currentCategory.name === category.name ? 'is-primary' : '']"
                  @click.prevent="setItemsAndGo(category, null)"
                  style="text-decoration: none"
                >
                  {{ category.name }}
                </a>
              </div>
              <div class="content">
                <v-list>
                  <v-list-item>
                    <a
                      v-for="sub_category in subCategories[category.id]"
                      :key="sub_category.id"
                      :href="getSubCategoryUrl(category, sub_category)"
                      @click.prevent="setItemsAndGo(category, sub_category)"
                      class="list-item-link"
                      style="text-decoration: none; display: block"
                    >
                      <div class="list-item">
                        <div>
                          <span class="general-font-size">
                            {{ sub_category.name }}
                          </span>
                        </div>
                      </div>
                    </a>
                  </v-list-item>
                </v-list>
              </div>
            </div>
            <div
              v-if="!loading"
              class="general-font-size is-dark-grey"
            >
              <a
                href="/public/search/facilities"
                class="is-clickable mx-5"
                :class="[currentRoute.includes('facilities') ? 'is-primary' : '']"
                @click.prevent="goTo('/public/search/facilities')"
              >
                Anbietersuche
              </a>
              <a
                href="/public/search/courses"
                class="is-clickable mx-5"
                :class="[currentRoute.includes('courses') ? 'is-primary' : '']"
                @click.prevent="goTo('/public/search/courses')"
              >
                Kurse
              </a>
              <a
                href="/public/search/events"
                class="is-clickable mx-5"
                :class="[currentRoute.includes('events') ? 'is-primary' : '']"
                @click.prevent="goTo('/public/search/events')"
              >
                Veranstaltungen
              </a>
            </div>
          </div>
        </div>
      </v-app-bar-title>
      <div class="align-center d-flex">
        <div
          class="has-bg-primary text-white offer py-1"
          v-if="!useUser().loggedIn() && breakPoints.width.value >= 1610 && currentRoute !== '/register'"
        >
          <v-row class="mx-1 text-center">
            <v-col
              class="flex-column align-center is-clickable"
              @click="goToRegister()"
            >
              <div class="font-weight-medium">Dein Angebot fehlt?</div>
              <div class="font-weight-light">Registriere dich!</div>
            </v-col>
          </v-row>
        </div>
        <div
          class="align-center d-flex is-clickable"
          v-if="breakPoints.width.value <= 1619 && currentRoute !== '/register' && !useUser().loggedIn() && !appStore.loading"
          @click="goToRegister()"
        >
          <img :src="regiterIcon" />
        </div>
        <div
          class="pl-3"
          v-if="!appStore.loading"
        >
          <v-btn
            v-if="!useUser().loggedIn()"
            color="primary"
            icon
            @click="goToLogin"
          >
            <img :src="loginIcon" />
          </v-btn>
        </div>
        <div class="d-flex align-center main">
          <a
            class="mx-3 menu-list general-font-size is-dark-grey pointer"
            v-if="useUser().isAdmin() && breakPoints.width.value >= 1530"
            href="admin?filter="
            @click.prevent="saveCurrentUrlAndRoute('/admin', '')"
            style="text-decoration: none"
          >
            Admin-Bereich
          </a>
          <a
            class="mx-3 menu-list general-font-size pointer is-dark-grey"
            v-else-if="useUser().isFacilityOwner() && breakPoints.width.value >= 1530"
            href="/admin/care_facilities?filter=showAll"
            @click.prevent="saveCurrentUrlAndRoute('/admin/care_facilities', 'showAll')"
            style="text-decoration: none"
          >
            Meine Einrichtung
          </a>
          <PublicLayoutsMiniMenu
            :current-user="currentUser"
            :user-is-admin="userIsAdmin"
            v-if="!appStore.loading"
          />
          <v-skeleton-loader
            v-if="appStore.loading"
            type="avatar"
          ></v-skeleton-loader>
        </div>
      </div>
      <div
        v-if="breakPoints.width.value < 1460 && !appStore.loading"
        class="d-flex align-center"
        align="center"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </div>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      temporary
      width="1000"
      class="d-flex justify-center"
    >
      <div class="navigation-drawer-content">
        <div
          class="has-bg-primary text-white offer d-flex align-center justify-center py-2 my-5"
          v-if="!useUser().loggedIn() && currentRoute !== '/register'"
        >
          <div
            @click="goToRegister()"
            class="text-center"
          >
            <div class="general-font-size font-weight-medium mb-1">Dein Angebot fehlt?</div>
            <div class="general-font-size font-weight-light">Registriere dich!</div>
          </div>
        </div>
        <v-btn
          v-if="!useUser().loggedIn()"
          color="primary"
          class="general-font-size my-2"
          @click="goToLogin"
        >
          Einloggen
        </v-btn>
        <div
          v-if="useUser().loggedIn() && currentUser"
          class="d-flex ml-5 my-2"
        >
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
            <v-list-item-title>{{ currentUser.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ currentUser.role }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
          </v-list-item>
        </div>
        <div class="logged-in-actions ml-5">
          <span
            class="menu-list pointer"
            v-if="useUser().isAdmin()"
            href="/admin"
            @click.prevent="saveCurrentUrlAndRoute('/admin', '')"
          >
            <v-icon
              color="#8AB61D"
              class="mr-2"
              >mdi-cog</v-icon
            >
            <span class="general-font-size">Admin-Bereich</span>
          </span>
          <span
            class="menu-list pointer general-font-size"
            v-else-if="useUser().isFacilityOwner()"
            href="/admin/care_facilities?filter=showAll"
            @click.prevent="saveCurrentUrlAndRoute('/admin/care_facilities', 'showAll')"
          >
            Meine Einrichtung
          </span>
          <div
            v-if="useUser().currentUser"
            @click="useUser().logout(), (drawer = !drawer), reload()"
          >
            <v-icon
              color="#8AB61D"
              class="mr-2"
              >mdi-logout</v-icon
            >
            <span class="general-font-size">Logout</span>
          </div>
        </div>

        <v-divider class="mt-5"></v-divider>
        <div
          class="categories-wrapper-mobile py-5 is-clickable d-flex"
          :class="[currentRoute.includes(category.id) ? 'is-visited' : '']"
          v-for="(category, index) in categories"
          :key="index"
        >
          <div class="d-flex align-center">
            <img
              v-if="category.name.includes('Prävention')"
              class="icons-menu mr-5"
              :src="iconHealth"
            />
            <img
              v-else
              class="icons-menu mr-5"
              :src="iconSick"
            />
            <span
              class="is-clickable general-font-size"
              @click="setItemsAndGo(category, null)"
            >
              {{ category.name }}
            </span>
          </div>
        </div>
        <template
          v-if="!loading"
          class="main"
        >
          <div
            href="/public/search/facilities"
            class="is-clickable categories-wrapper-mobile py-5"
            :class="[currentRoute.includes('facilities') ? 'is-visited' : '']"
            @click.prevent="goTo('/public/search/facilities')"
          >
            <div class="d-flex align-center general-font-size">
              <img
                class="icons-menu mr-5"
                :src="iconFacility"
              />
              <span>Anbieter</span>
            </div>
          </div>
          <div
            href="/public/search/courses"
            class="is-clickable categories-wrapper-mobile py-5"
            :class="[currentRoute.includes('courses') ? 'is-visited' : '']"
            @click.prevent="goTo('/public/search/courses')"
          >
            <div class="d-flex align-center general-font-size">
              <img
                class="icons-menu mr-5"
                :src="iconCourse"
              />
              <span>Kurse</span>
            </div>
          </div>
          <div
            href="/public/search/events"
            class="is-clickable categories-wrapper-mobile py-5"
            :class="[currentRoute.includes('events') ? 'is-visited' : '']"
            @click.prevent="goTo('/public/search/events')"
          >
            <div class="d-flex align-center general-font-size">
              <img
                class="icons-menu mr-5"
                :src="iconEvent"
              />
              <span>Veranstaltungen</span>
            </div>
          </div>
        </template>
      </div>
      <div class="terms-of-use d-flex justify-start ga-7">
        <v-icon
          color="#8AB61D"
          class="ml-2 py-5"
          >mdi-note-check-outline</v-icon
        >
        <div
          class="is-clickable general-font-size"
          @click.prevent="goTo('/rules_of_conduct')"
        >
          Nutzungsbedingungen
        </div>
        <v-icon></v-icon>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import { useFilterStore } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import regiterIcon from "@/assets/icons/registerIcons/icon_registration.svg";
import loginIcon from "@/assets/icons/registerIcons/icon_login.svg";
import iconCourse from "~/assets/icons/mobileMenu/icon_course.svg";
import iconEvent from "~/assets/icons/mobileMenu/icon_event.svg";
import iconFacility from "~/assets/icons/mobileMenu/icon_facility.svg";
import iconHealth from "~/assets/icons/mobileMenu/icon_health.svg";
import iconSick from "~/assets/icons/mobileMenu/icon_sick.svg";
import iconNews from "~/assets/icons/mobileMenu/icon_news.svg";
const currentUser = ref(null);
const router = useRouter();
const categories = ref([]);
const subCategories = ref<any>({});
const sub_categoryId = ref({});
const drawer = ref(false);
const appStore = useAppStore();
const route = useRoute();
const loading = ref(true);
const filterStore = useFilterStore();
const breakPoints = useBreakpoints();

const categoriesApi = useCollectionApi();
categoriesApi.setBaseApi(usePublicApi());

const currentCategory = ref(null);
const currentSubCategory = ref(null);

const getCategories = async () => {
  loading.value = true;
  categoriesApi.setEndpoint(`categories`);
  const options = {
    page: 1,
    per_page: 999,
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
    per_page: 999,
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
    currentCategory.value = category;
    currentSubCategory.value = sub_category;
    router.push({
      path: `/public/categories/${category.id}`,
      query: { sub_category_id: sub_category.id },
    });
    if (sub_category.id) {
      currentCategory.value = category;
      currentSubCategory.value = sub_category;
      sub_categoryId.value = sub_category.id;
    }
  } else {
    currentCategory.value = category;
    currentSubCategory.value = sub_category;
    return router.push({
      path: `/public/categories/${category.id}`,
      query: null,
    });
  }

  useNuxtApp().$bus.$emit("setSubCategory", sub_category.id);
};

const getItemsAndGo = (category: any, sub_category: any) => {
  if (sub_category) {
    return `/public/categories/${category.id}?sub_category_id=${sub_category.id}`;
  } else {
    return `/public/categories/${category.id}`;
  }
};

const getSubCategoryUrl = (category: any, sub_category: any) => {
  return `/public/categories/${category.id}?sub_category_id=${sub_category.id}`;
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

const saveCurrentUrlAndRoute = (routeTo: string, query: string) => {
  appStore.dashboardBackLink = window.location.pathname;

  router.push({ path: routeTo, query: { filter: query } });
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
  padding: 0 80px;
  @include md {
    padding: 0;
  }
}
.v-toolbar__content {
  overflow: visible;
  .v-toolbar-title {
    margin-inline-start: 0;
  }
  @include md {
    padding: 1rem;
  }
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
.categories-wrapper-mobile {
  position: relative;
  padding: 0 15px;
  min-height: 50px;
  align-items: center;
  display: flex;
  height: 4rem;
  justify-content: space-between;
  border-bottom: rgb(0, 0, 0, 0.1) 1px solid;
  &.is-visited {
    background-color: rgb(242, 242, 242);
  }
}
.categories-wrapper {
  position: relative;

  &:hover .content {
    opacity: 1;
    transform: scale(1);
    pointer-events: all;
    width: max-content;
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
  padding: 0.5rem;
  margin-top: 2rem;
  @include md {
    margin-top: 0;
  }
  @include sm {
    margin-top: 0;
  }
  @include xs {
    margin-top: 0;
  }

  .logged-in-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.terms-of-use {
  position: fixed;
  margin-bottom: 1rem;
  width: 100%;
  padding: 0 15px;
  display: flex;
  bottom: 0;
  height: 4rem;
  align-items: center;
  justify-content: space-between;
  border-top: rgb(0, 0, 0, 0.3) 1px solid;
}

.icons-menu {
  width: 40px;
}

a {
  color: $dark-grey !important;
}
</style>
