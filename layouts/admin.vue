<template>
  <v-app>
    <v-navigation-drawer permanent>
      <div class="d-flex justify-center">
        <router-link to="/admin">
          <img class="mt-3 ml-3" src="~/assets/images/logo.png" width="200" />
        </router-link>
      </div>
      <v-list-item>
        <v-list-item-title class="text-h6 my-3"> Gesundheitsplattform </v-list-item-title>
        <v-list-item-subtitle> Smart Wendeler Land </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <div v-if="!user.currentUser.is_active_on_health_scope" class="d-flex align-center">
        <v-alert type="warning" density="compact"
          >Du bist zur Zeit in Prüfung und nicht freigegeben.
          <v-tooltip location="top" width="200">
            <template v-slot:activator="{ props }">
              <v-icon class="is-clickable" v-bind="props">mdi-information-outline</v-icon>
            </template>
            <span>
              Der Landkreis prüft momentan deine Kontaktdaten, sowie die Daten deiner Einrichtung. Nach erfolgreichem
              Abschluss wirst du freigeschaltet. Du kannst weiterhin deine Inhalte pflegen.
            </span>
          </v-tooltip>
        </v-alert>
      </div>
      <v-list dense nav>
        <v-list-item :to="appStore.dashboardBackLink || '/'" @click.prevent="routeBack">
          <v-icon>mdi-arrow-left</v-icon> Zurück zur Website
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/admin/matomo" nuxt>
            <v-icon>mdi-arrow-left</v-icon> Zu den Statistiken
          </v-list-item>
        <v-divider></v-divider>
        <template v-if="useUser().isAdmin()">
          <v-list-item link to="/admin" nuxt>  Admin-Bereich (Change Log) </v-list-item>
          <v-divider></v-divider>
          <v-list-item link to="/admin/filter/facilities" nuxt> Einrichtungsfilter </v-list-item>
          <v-list-item link to="/admin/filter/events" nuxt> Veranstaltungsfilter </v-list-item>
          <v-list-item link to="/admin/filter/news" nuxt> Beitragsfilter </v-list-item>
          <v-divider></v-divider>
          <v-list-item link to="/admin/categories" nuxt> Bereiche und Kategorien </v-list-item>
          <v-divider></v-divider>
        </template>
        <v-list-item
          link
          to="/admin/care_facilities"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Einrichtung</span>
          <span v-else>Einrichtungen</span>
        </v-list-item>
        <v-list-item
          link
          to="/admin/courses_events"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Kurse und Veranstaltungen</span>
          <span v-else>Kurse und Veranstaltungen</span>
        </v-list-item>
        <v-list-item
          link
          to="/admin/news_articles"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Beiträge</span>
          <span v-else>Beiträge</span>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          link
          to="/admin/user_profile"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
        >
          <span>Mein Profil</span>
        </v-list-item>
        <v-list-item
          link
          to="/admin/tooltips"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('tooltips', 'list')"
        >
          Tooltips
        </v-list-item>
        <v-list-item link to="/admin/users" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('users', 'list')">
          Benutzer
        </v-list-item>
        <v-list-item @click="handleLogout"> <v-icon>mdi-logout</v-icon> Logout </v-list-item>
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
import { useAppStore } from "~/store/app";

const user = useUser();
const appStore = useAppStore();
const router = useRouter();

const adminStore = useAdminStore();
const setupFinished = ref(false);

const handleLogout = () => {
  user.logout();
};

const routeBack = () => {
  router.push({ path: appStore.dashboardBackLink || "/" });

  appStore.dashboardBackLink = "";
};

onMounted(async () => {
  adminStore.loading = true;
  setupFinished.value = await user.setupFinished();
  adminStore.loading = false;
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
</style>
