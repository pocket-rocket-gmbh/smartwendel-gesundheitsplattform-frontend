<template>
  <v-app v-if="useUser().currentUser">
    <div
      @click.stop="drawer = !drawer"
      class="d-flex justify-start"
    >
      <v-icon
        size="x-large"
        class="is-dark-grey"
        >mdi-menu-close</v-icon
      >
    </div>
    <v-navigation-drawer v-model="drawer">
      <div
        @click.stop="drawer = !drawer"
        class="d-flex justify-end"
      >
        <v-icon
          size="x-large"
          class="is-dark-grey"
          >mdi-backburger</v-icon
        >
      </div>
      <div class="d-flex">
        <router-link to="/">
          <img
            class="mt-3 ml-4"
            src="~/assets/images/logo.png"
            width="200"
          />
        </router-link>
      </div>
      <v-list-item>
        <v-list-item-title class="general-font-size is-dark-grey font-weight-bold my-1 mb-5"> Gesundheitsplattform </v-list-item-title>
        <v-list-item-subtitle class="has-lk-logo my-1"
          ><img
            :src="logo"
            width="40"
          />
          Smart Wendeler Land
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <div
        v-if="!useUser().statusOnHealthScope()"
        class="d-flex align-center"
      >
        <v-alert
          type="info"
          density="compact"
          color="grey"
        >
          Du bist zur Zeit in Prüfung und nicht freigegeben.
          <v-tooltip
            location="top"
            width="200"
          >
            <template v-slot:activator="{ props }">
              <v-icon
                class="is-clickable"
                v-bind="props"
                >mdi-information-outline</v-icon
              >
            </template>
            <span>
              Der Landkreis prüft momentan deine Kontaktdaten, sowie die Daten deiner Einrichtung. Nach erfolgreichem Abschluss wirst du freigeschaltet. Du
              kannst weiterhin deine Inhalte pflegen.
            </span>
          </v-tooltip>
        </v-alert>
      </div>
      <div
        class="d-flex align-center"
        v-if="daysNotUpdated >= 120"
      >
        <v-alert
          type="info"
          density="compact"
          :color="daysNotUpdated >= 233 ? 'red' : daysNotUpdated >= 134 ? 'error' : daysNotUpdated >= 120 ? 'warning' : 'grey'"
        >
          <p>
            Deine Daten wurden seit {{ useDatetime().parseDatetime(careFacilitiesLastUpdated) }} nicht aktualisiert. Deine Inhalte werden in
            {{ daysLeftBeforeOffline }} Tagen nicht mehr angezeigt, da wir den Benutzern der Gesundheitsplattform Datenaktualität garantieren.
          </p>
          <br />
          <p>Bitte aktulisiere zeitnah deine Daten.</p>
        </v-alert>
      </div>
      <v-list
        dense
        nav
      >
        <template v-if="useUser().isAdmin()">
          <v-list-item
            link
            to="/admin/matomo"
            nuxt
            class="general-font-size is-dark-grey"
          >
            <v-icon>mdi-arrow-left</v-icon> Zu den Statistiken
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin"
            nuxt
            class="general-font-size is-dark-grey"
          >
            Dashboard
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin/filter/facilities"
            nuxt
            class="general-font-size is-dark-grey"
          >
            Einrichtungsfilter
          </v-list-item>
          <v-list-item
            link
            to="/admin/filter/courses"
            nuxt
            class="general-font-size is-dark-grey"
          >
            Kursfilter
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
            link
            to="/admin/categories?filter="
            nuxt
            class="general-font-size is-dark-grey"
          >
            Bereiche und Kategorien
          </v-list-item>
          <v-list-item link to="/admin/complaints?filter=" nuxt class="general-font-size is-dark-grey">
            Beschwerde
          </v-list-item>
          <v-divider></v-divider>
        </template>
        <v-list-item
          link
          to="/admin/care_facilities?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
          class="general-font-size is-dark-grey"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Einrichtung</span>
          <span v-else>Einrichtungen</span>
        </v-list-item>
        <v-list-item
          :disabled="!setupFinished"
          link
          to="/admin/courses?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
          class="general-font-size is-dark-grey"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Kurse</span>
          <span v-else>Kurse</span>
        </v-list-item>
        <v-list-item
          :disabled="!setupFinished"
          link
          to="/admin/events?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
          class="general-font-size is-dark-grey"
        >
          <span v-if="useUser().isFacilityOwner()">Meine Veranstaltungen</span>
          <span v-else>Veranstaltungen</span>
        </v-list-item>
        <v-list-item
          :disabled="!setupFinished"
          link
          to="/admin/news_articles?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')"
          class="general-font-size is-dark-grey"
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
          class="general-font-size is-dark-grey"
        >
          <span>Mein Konto</span>
        </v-list-item>
        <v-list-item
          link
          to="/admin/tooltips?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('tooltips', 'list')"
          class="general-font-size is-dark-grey"
        >
          Tooltips
        </v-list-item>
        <v-list-item
          link
          to="/admin/users?filter=showAll"
          nuxt
          v-if="useAccessPrivileges().canAccessEndpointAction('users', 'list')"
          class="general-font-size is-dark-grey"
        >
          Benutzer
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="handleLogout"
          class="general-font-size is-dark-grey"
        >
          <v-icon>mdi-logout</v-icon> Logout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container
        :fluid="true"
        class="container"
      >
        <slot />
        <div
          v-if="adminStore.loading"
          class="loading"
        >
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

const careFacilitiesLastUpdated = computed(() => {
  return user.currentUser?.last_care_facility_updated_at;
});

const daysNotUpdated = computed(() => {
  const lastUpdated = user.currentUser?.last_care_facility_updated_at;
  if (!lastUpdated) return 0;
  const lastUpdatedDate = new Date(lastUpdated);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - lastUpdatedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

const daysLeftBeforeOffline = computed(() => {
  const offlineThreshold = 240;
  return offlineThreshold - daysNotUpdated.value;
});

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
