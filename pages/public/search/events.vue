<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Veranstaltungen"
        sub-title="Finde die passende Veranstaltung!"
        :filter-kind="'event'"
      />
      <div class="container">
        <div class="results">
          <PublicSearchTheFilteredCareFacilities :doubled="true"/>
        </div>
      </div>
      <v-row v-if="!filterStore.filteredResults.length && !appStore.loading">
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

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();

const appStore = useAppStore();

const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

onMounted(async () => {
  filterStore.currentKinds = ["event"];
  filterStore.updateFromUrlQuery();
  filterStore.loadAllResults();
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
