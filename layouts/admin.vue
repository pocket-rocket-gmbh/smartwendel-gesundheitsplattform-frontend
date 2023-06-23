<template>
  <v-app>
    <v-navigation-drawer permanent>
      <div class="d-flex justify-center">
        <router-link to="/admin">
          <img class="mt-3 ml-3" src="~/assets/images/logo.png" width="200" />
        </router-link>
      </div>
      <v-list-item>
        <v-list-item-title class="text-h6 my-3">
          Gesundheits- und <br> Pflegeplattform
        </v-list-item-title>
        <v-list-item-subtitle>
          Smart Wendeler Land
        </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>

      <v-list
        dense
        nav
      >
        <v-list-item @click="routeBack">
          <v-icon>mdi-arrow-left</v-icon> Zurück zur Website
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/admin" nuxt v-if="useUser().isAdmin()">
          Dashboard
        </v-list-item>
        <v-list-item link to="/admin/tags" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('tags', 'list')">
          Tags
        </v-list-item>
        <v-list-item link to="/admin/categories" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('categories', 'list')">
          Bereiche und Kategorien
        </v-list-item>
        <v-list-item link to="/admin/care_facilities" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')">
          Einrichtungen
        </v-list-item>
        <v-list-item link to="/admin/courses_events" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('care_facilities', 'list')">
          Kurse und Veranstaltungen
        </v-list-item>
        <v-list-item link to="/admin/news_articles" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('news_articles', 'list')">
          Beiträge
        </v-list-item>
        <v-list-item link to="/admin/tooltips" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('tooltips', 'list')">
          Tooltips
        </v-list-item>
        <v-list-item link to="/admin/users" nuxt v-if="useAccessPrivileges().canAccessEndpointAction('users', 'list')">
          Benutzer
        </v-list-item>
        <v-list-item @click="handleLogout">
          <v-icon>mdi-logout</v-icon> Logout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container :fluid="true">
        <slot />
      </v-container>
    </v-main>

    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
  </v-app>
</template>

<script lang="ts" setup>
import { useAccessPrivileges } from '~/composables';
import { useUser } from '~/composables';
import { useAppStore } from '~/store/app';

const user = useUser();
const appStore = useAppStore();
const router = useRouter();

const handleLogout = () => {
  console.log("Handle logout")
  user.logout()
}

const routeBack = () => {
  router.push({path: appStore.dashboardBackLink || '/'})

  appStore.dashboardBackLink = "";
}
</script>