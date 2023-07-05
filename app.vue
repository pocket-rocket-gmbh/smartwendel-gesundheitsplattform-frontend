<template>
  <NuxtLayout>
    <div width="300" class="mt-5" v-if="useUser().isAdmin()">
        <v-alert type="warning" closeable density="compact" closable>Neu: ist es jetzt möglich, ein Protokoll der vorgenommenen Änderungen zu sehen.
          <span class="is-clickable px-5">
            <nuxt-link to="/admin"><span align="center" class="mt-6 text-h6">zum Log</span></nuxt-link>
          </span>
        </v-alert>
        </div>
    <NuxtPage />
  </NuxtLayout>
</template>