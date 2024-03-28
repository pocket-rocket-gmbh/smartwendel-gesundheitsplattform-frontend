<template>
  <v-app v-if="!loading">
    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
    <PublicLayoutsTopBar />
    <!--     <ClientOnly>
      <PublicCookieBanner />
    </ClientOnly> -->
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

const loading = ref(true);

const setTimeOutForPageLoad = () => {
  setTimeout(() => {
    loading.value = false;
  }, 100);
};

const getTooltips = async () => {
  await api.retrieveCollection();
  tooltipsStore.tooltips = api.items;
};

const lastYPosition = ref(-1);
const handleScroll = () => {
  const direction = lastYPosition.value - window.scrollY > 0 ? 1 : -1;
  lastYPosition.value = window.scrollY;
  appStore.showTopbar = window.scrollY < 100 || direction === 1;
};

const initialize = async () => {
  return Promise.allSettled([
    useFilterStore().loadAllFilters(),
    useFilterStore().loadAllCommunities(),
    useFilterStore().loadUnalteredAllResults(),
    useFilterStore().loadAllCategories(),
    getTooltips(),
    useFilterStore().resetAllFilters(),
  ]);
};

onMounted(async () => {
  setTimeOutForPageLoad();
  document.addEventListener("scroll", handleScroll);

  appStore.loading = true;
  await initialize();
  await useFilterStore().loadAllResults();

  await Promise.allSettled([
    await useFilterStore().loadAllFacilityFilters(),
    await useFilterStore().loadAllServiceFilters(),
  ]);
  appStore.loading = false;
});

onUnmounted(() => {
  document.removeEventListener("wheel", handleScroll);
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
