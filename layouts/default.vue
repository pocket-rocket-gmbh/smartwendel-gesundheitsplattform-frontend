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
      <PublicLoginPanel v-if="!useUser().loggedIn()" />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useAppStore } from "~/store/app";
import { useTooltipsStore } from "~~/store/tooltips";

const appStore = useAppStore();
const tooltipsStore = useTooltipsStore();
const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tooltips");

const getTooltips = async () => {
  await api.retrieveCollection();
  tooltipsStore.tooltips = api.items;
};

const handleScroll = (e: WheelEvent) => {
  const direction = e.deltaY > 0 ? 1 : -1;

  appStore.showTopbar = direction === -1;
};

onMounted(() => {
  getTooltips();
  const auth = localStorage.getItem("smartwendel_gesundheitsplattform_authenticated");
  if (auth && auth === "true") {
    useAuthStore().$patch({
      authenticated: true,
    });
  }

  document.addEventListener("wheel", handleScroll);
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleScroll);
});

const authenticated = computed(() => {
  return useAuthStore().authenticated;
});
</script>

<style lang="scss">
// @import "@/assets/sass/main";

// .v-application {
//   @include md {
//     overflow: hidden;
//   }
// }
</style>
