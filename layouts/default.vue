<template>
  <v-app>
    <div v-if="loading"></div>
    <PublicPasswordProtection
      v-else-if="!authenticated"
    />
    <div v-else>
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
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useTooltipsStore } from '~~/store/tooltips'
const loading = ref(true)

const tooltipsStore = useTooltipsStore()
const api = useCollectionApi()
api.setBaseApi(usePublicApi())
api.setEndpoint('tooltips')


onMounted(async () => {
  loading.value = true
  const auth = localStorage.getItem("smartwendel_gesundheitsplattform_authenticated");

  if (auth && auth === "true") {
    useAuthStore().$patch({
      authenticated: true
    });
  }

  if (!tooltipsStore.tooltips) {
    await api.retrieveCollection()
    tooltipsStore.tooltips = api.items
  }

  loading.value = false
});

const authenticated = computed(() => {
  return useAuthStore().authenticated;
});
</script>

<style lang="sass" scoped></style>
