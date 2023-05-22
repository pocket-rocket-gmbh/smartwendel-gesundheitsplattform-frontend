<template>
  <v-app>
    <v-navigation-drawer permanent>
      <router-link to="/admin">
        <img class="mt-3 ml-3" src="~/assets/images/logo.png" height="60" />
      </router-link>
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
        <v-list-item link to="/" nuxt>
          <v-icon>mdi-arrow-left</v-icon> Zurück zur Website
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/admin" nuxt>
          Dashboard
        </v-list-item>
        <v-list-item link to="/admin/tags" nuxt>
          Tags
        </v-list-item>
        <v-list-item link to="/admin/categories" nuxt>
          Bereiche & Kategorien
        </v-list-item>
        <v-list-item link to="/admin/care_facilities" nuxt>
          Einrichtungen
        </v-list-item>
        <v-list-item link to="/admin/news_articles" nuxt>
          News und Beiträge
        </v-list-item>
        <v-list-item link to="/admin/courses_events" nuxt>
          Kurse und Veranstaltungen
        </v-list-item>
        <v-list-item link to="/admin/messages" nuxt>
          Nachrichten
        </v-list-item>
        <v-list-item link to="/admin/tooltips" nuxt>
          Tooltips
        </v-list-item>
        <v-list-item link to="/admin/gamification_games" nuxt>
          Gamification
        </v-list-item>
        <v-list-item link to="/admin/users" nuxt>
          Benutzer
        </v-list-item>
        <v-list-item @click="useUser().logout()">
          <v-icon>mdi-logout</v-icon> Logout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container :fluid="true">
        <slot />
      </v-container>
    </v-main>

    <Snackbar></Snackbar>
  </v-app>
</template>

<script lang="ts">
</script>