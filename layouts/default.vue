<template>
  <v-app>
    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
    <PublicLayoutsTopBar />
    <v-main>
      <slot />
    </v-main>
    <PublicLayoutsFooter />
  </v-app>
</template>

<script setup lang="ts">
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
  getTooltips();

  document.addEventListener("wheel", handleScroll);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  document.addEventListener("touchend", handleTouchEnd);

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
<<<<<<< HEAD
=======

>>>>>>> main
</script>

<style lang="scss">
// @import "@/assets/sass/main";

// .v-application {
//   @include md {
//     overflow: hidden;
//   }
// }
</style>
