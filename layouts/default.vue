<template>
  <v-app>
    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
    <div>
      <PublicLayoutsTopBar />
      <v-main>
        <slot />
      </v-main>
      <PublicLayoutsFooter />
      <PublicLoginPanel  v-if="!useUser().loggedIn()"/>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";

onMounted(() => {
  const auth = localStorage.getItem("smartwendel_gesundheitsplattform_authenticated");
  if (auth && auth === "true") {
    useAuthStore().$patch({
      authenticated: true,
    });
  }
});

const authenticated = computed(() => {
  return useAuthStore().authenticated;
});
</script>

<style lang="sass" scoped></style>
