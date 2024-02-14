<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox title="Kurse" sub-title="Finde den passenden Kurs!" :filter-kind="'course'" />
      <div class="container">
        <div class="filters" v-if="showSearchFilter">
          <PublicSearchTheFilter :filterKind="'course'" />
        </div>
        <div class="results">
          <PublicSearchTheFilteredCareFacilities />
        </div>
      </div>
      <v-row v-if="!filterStore.filteredResults.length">
        <v-col class="d-flex flex-column align-center justify-center">
          <div class="flex-column" align="center">
            <div class="general-font-size text-h4">
              Leider haben wir kein Suchergebnis zu deiner Anfrage.
            </div>
          </div>
          <img :src="noResults" class="no-results-image mt-10" />
        </v-col>
      </v-row>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";
import { useFilterStore } from "~/store/searchFilter";
import { useAppStore } from "~/store/app";
import noResults from "~/assets/images/search_no_results.jpg";

const appStore = useAppStore();

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();
const showMap = ref(true);

watch(
  () => appStore.loading,
  async () => {
    if (appStore.loading) return;
    await filterStore.loadAllResults();
    filterStore.loadFilteredFacilityMainFilters();
  }
);

const startedAt = ref<null | "facilities" | "services" | "communities">(null);

const handleStartedAt = (origin: "facilities" | "services" | "communities") => {
  if (startedAt.value) {
    startedAt.value = origin;
    return;
  }

  if (filterStore.currentFacilityTags.length === 0 && filterStore.currentServiceTags.length === 0 && filterStore.currentZips.length === 0) {
    if (!startedAt.value) {
      startedAt.value = null;
      return;
    }
    startedAt.value = origin;
  }
};

watch(
  () => filterStore.currentFacilityTags,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("facilities");

    if (startedAt.value !== "services") filterStore.loadAllServiceFilters();
    if (startedAt.value !== "communities") filterStore.loadFilteredCommunities();
  },
  {
    deep: true,
  }
);

watch(
  () => filterStore.currentZips,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("communities");

    if (startedAt.value !== "services") filterStore.loadAllServiceFilters();
    if (startedAt.value !== "facilities") filterStore.loadFilteredFacilityMainFilters();
  },
  {
    deep: true,
  }
);

watch(
  () => filterStore.currentServiceTags,
  async () => {
    await filterStore.loadAllResults();

    handleStartedAt("services");

    if (startedAt.value !== "communities") filterStore.loadFilteredCommunities();
    if (startedAt.value !== "facilities") filterStore.loadFilteredFacilityMainFilters();
  },
  {
    deep: true,
  }
);


const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

onMounted(async () => {
  filterStore.currentKinds = ["course"];
  startedAt.value = null;
  filterStore.updateFromUrlQuery();
  await filterStore.loadAllResults();
  filterStore.loadAllServiceFilters()

  await filterStore.loadAllFacilityFilters();
  filterStore.loadFilteredFacilityMainFilters();
});

onBeforeUnmount(() => {
  filterStore.resetAllFilters();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 2rem 5rem
  display: flex
  gap: 1rem

  @include md
    padding: 1rem

  .filters
    flex: 1

  .results
    flex: 2

  .row
    max-width: 100%
    margin: 0
    gap: 1rem
    @include md
      margin: 0

.no-results-image
  max-width: 500px
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15)
  border-radius: 20px
</style>
