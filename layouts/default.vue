<template>
  <v-app>
    <ClientSnackbar />

    <div>
      <PublicLayoutsTopBar />
      <v-main>
        <slot />
      </v-main>
      <PublicLayoutsFooter />
      <PublicLayoutsSubFooter />
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
