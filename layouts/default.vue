<template>
  <v-app v-if="!loading">
    <v-dialog
      width="500"
      v-model="questionModalopen"
      transition="dialog-bottom-transition"
      class="mt-10"
      persistent
    >
      <v-card class="dialog">
        <v-card-text class="card-text">
          <v-row>
            <v-col>
              <h2 class="mb-4">Mach gesundesWND noch besser!</h2>
              <div class="general-font-size">
                Teile deine Erfahrung mit uns – schnell und unkompliziert in nur 5 Minuten. Und mit etwas Glück gewinnst du einen von 8 Gutscheinen!
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-row no-gutters>
            <v-col class="d-flex justify-start">
              <v-btn
                variant="flat"
                @click="questionModalopen = false"
              >
                <span> Schließen </span>
              </v-btn>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn
                variant="outlined"
                class="save-buttons"
                elevation="0"
                href="https://survey.lamapoll.de/Evaluation-GPP-Start/de"
                target="_blank"
                @click="questionModalopen = false"
              >
                Jetzt mitmachen
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ClientOnly>
      <ClientSnackbar />
    </ClientOnly>
    <PublicLayoutsTopBar />
    <!--     <ClientOnly>
      <PublicCookieBanner />
    </ClientOnly> -->
    <!-- <PublicAccessibilityPanel /> -->
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

const questionModalopen = ref(false);

const setTimeOutForPageLoad = () => {
  setTimeout(() => {
    loading.value = false;
  }, 100);
};

const setTimeOutForPoupup = () => {
  setTimeout(() => {
    questionModalopen.value = true;
  }, 25000);
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
  setTimeOutForPoupup();
  document.addEventListener("scroll", handleScroll);

  appStore.loading = true;
  await initialize();
  await useFilterStore().loadAllResults();

  await Promise.allSettled([await useFilterStore().loadAllFacilityFilters(), await useFilterStore().loadAllServiceFilters()]);
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
