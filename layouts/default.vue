<template>
  <v-app>
    <template v-if="loading"></template>
    <ClientOnly v-else-if="!authenticated">
      <PublicPasswordProtection  />
    </ClientOnly>
    <template v-else>
      <ClientOnly>
        <ClientSnackbar />
      </ClientOnly>
      <PublicLayoutsTopBar />
      <v-main>
        <slot />
      </v-main>
      <PublicLayoutsFooter />
      <PublicLoginPanel v-if="!useUser().loggedIn()" />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { useFilterStore } from "~/store/searchFilter";
import { useAppStore } from "~/store/app";
import { useTooltipsStore } from "~~/store/tooltips";

const appStore = useAppStore();
const tooltipsStore = useTooltipsStore();
const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tooltips");

const loading = ref(false);

const getTooltips = async () => {
  await api.retrieveCollection();
  tooltipsStore.tooltips = api.items;
};

const handleScroll = (e: WheelEvent) => {
  const direction = e.deltaY > 0 ? 1 : -1;

  appStore.showTopbar = window.scrollY < 100 || direction === -1;
};
const lastTouchY = ref(-1);
const handleTouchStart = (e: TouchEvent) => {
  lastTouchY.value = e.touches[0].clientY;
};
const handleTouchMove = (e: TouchEvent) => {
  const direction = lastTouchY.value - e.touches[0].clientY > 0 ? 1 : -1;
  appStore.showTopbar = window.scrollY < 100 || direction === -1;
  lastTouchY.value = e.touches[0].clientY;
};
const handleTouchEnd = (e: TouchEvent) => {
  lastTouchY.value = -1;
};

onMounted(async () => {
  loading.value = true;
  const auth = localStorage.getItem("smartwendel_gesundheitsplattform_authenticated");
  getTooltips();

  if (auth && auth === "true") {
    useAuthStore().$patch({
      authenticated: true,
    });
  }

  document.addEventListener("wheel", handleScroll);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchend", handleTouchEnd);

  if (auth && auth === "true") {
    useAuthStore().$patch({
      authenticated: true,
    });
  }

  if (!tooltipsStore.tooltips) {
    await api.retrieveCollection();
    tooltipsStore.tooltips = api.items;
  }

  loading.value = false;
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleScroll);
  document.removeEventListener("touchstart", handleTouchStart);
  document.removeEventListener("touchmove", handleTouchMove);
  document.removeEventListener("touchend", handleTouchEnd);
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
