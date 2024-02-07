<template>
  <v-app v-if="useUser().currentUser">
    <div @click.stop="drawer = !drawer" class="d-flex justify-start">
      <v-icon size="x-large" class="is-secondary-color">mdi-menu-close</v-icon>
    </div>
    <v-navigation-drawer v-model="drawer">
      <div @click.stop="drawer = !drawer" class="d-flex justify-end">
        <v-icon size="x-large" class="is-secondary-color"
          >mdi-backburger</v-icon
        >
      </div>
      <div class="d-flex">
        <router-link to="/">
          <img class="mt-3 ml-4" src="~/assets/images/logo.png" width="200" />
        </router-link>
      </div>
      <v-list-item>
        <v-list-item-title
          class="general-font-size is-secondary-color font-weight-bold my-1 mb-5"
        >
          <div>Gesundheitsplattform</div>
          <div>Landkreis Wunsiedel</div>
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <div v-if="!useUser().statusOnHealthScope()" class="d-flex align-center">
        <v-alert type="info" density="compact" color="grey">
          Du bist zur Zeit in Prüfung und nicht freigegeben.
          <v-tooltip location="top" width="200">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props"
                >mdi-information-outline</v-icon
              >
            </template>
            <span>
              Der Landkreis prüft momentan deine Kontaktdaten, sowie die Daten
              deiner Einrichtung. Nach erfolgreichem Abschluss wirst du
              freigeschaltet. Du kannst weiterhin deine Inhalte pflegen.
            </span>
          </v-tooltip>
        </v-alert>
      </div>
      <v-list dense nav>
        <template v-if="useUser().isAdmin()">
          <v-list-item
            link
            to="/admin/matomo"
            nuxt
            class="general-font-size is-secondary-color"
          >
            <v-icon>mdi-arrow-left</v-icon> Zu den Statistiken
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin"
            nuxt
            class="general-font-size is-secondary-color"
          >
            Admin-Bereich
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin/filter/facilities"
            nuxt
            class="general-font-size is-secondary-color"
          >
            Einrichtungsfilter
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin/categories"
            nuxt
            class="general-font-size is-secondary-color"
          >
            Bereiche und Kategorien
          </v-list-item>
          <v-divider></v-divider>
        </template>
        <v-list-item
          link
          to="/admin/care_facilities"
          nuxt
          v-if="
            useAccessPrivileges().canAccessEndpointAction(
              'care_facilities',
              'list'
            )
          "
          class="general-font-size is-secondary-color"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Einrichtung</span>
          <span v-else>Einrichtungen</span>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          link
          to="/admin/user_profile"
          nuxt
          v-if="
            useAccessPrivileges().canAccessEndpointAction(
              'care_facilities',
              'list'
            )
          "
          class="general-font-size is-secondary-color"
        >
          <span>Mein Konto</span>
        </v-list-item>
        <v-list-item
          link
          to="/admin/tooltips"
          nuxt
          v-if="
            useAccessPrivileges().canAccessEndpointAction('tooltips', 'list')
          "
          class="general-font-size is-secondary-color"
        >
          Tooltips
        </v-list-item>
        <v-list-item
          link
          to="/admin/users"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('users', 'list')"
          class="general-font-size is-secondary-color"
        >
          Benutzer
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="handleLogout"
          class="general-font-size is-secondary-color"
        >
          <v-icon>mdi-logout</v-icon> Logout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container :fluid="true" class="container">
        <slot />
        <div v-if="adminStore.loading" class="loading">
          <div class="spinner"></div>
          Daten werden geladen...
        </div>
      </v-container>
    </v-main>

    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
  </v-app>
</template>

<script lang="ts" setup>
import { useAccessPrivileges } from "~/composables";
import { useUser } from "~/composables";
import { useAdminStore } from "~/store/admin";
import logo from "@/assets/images/lk-logo.png";

const user = useUser();

const drawer = ref(true);

const adminStore = useAdminStore();
const setupFinished = ref(false);

const handleLogout = () => {
  user.logout();
};

const checkSetupFinished = async () => {
  adminStore.loading = true;
  setupFinished.value = await user.setupFinished();
  adminStore.loading = false;
  useUser().statusOnHealthScope();
};

onMounted(async () => {
  await checkSetupFinished();
  useNuxtApp().$bus.$on("facilityUpdate", async () => {
    await checkSetupFinished();
  });
});
</script>

<style lang="scss" scoped>
@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.container {
  position: relative;

  .loading {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    backdrop-filter: blur(1px) brightness(95%);
    cursor: wait;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;

    .spinner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 2px solid #ccc;
      border-top-color: #000;
      animation: spinner 0.6s linear infinite;
    }
  }
}

.has-lk-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
