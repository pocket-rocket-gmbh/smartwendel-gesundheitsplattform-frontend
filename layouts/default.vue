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

const lastYPosition = ref(-1);
const handleScroll = () => {
  const direction = lastYPosition.value - window.scrollY > 0 ? 1 : -1;
  lastYPosition.value = window.scrollY;
  appStore.showTopbar = window.scrollY < 100 || direction === 1;
};

onMounted(async () => {
  loading.value = true;
  getTooltips();

  document.addEventListener("scroll", handleScroll);

  if (!tooltipsStore.tooltips) {
    await api.retrieveCollection();
    tooltipsStore.tooltips = api.items;
  }

  loading.value = false;
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