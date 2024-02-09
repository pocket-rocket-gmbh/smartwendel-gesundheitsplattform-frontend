<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Beiträge"
        sub-title="Deinen Wunschbeitrag auswählen"
        :filter-kind="'news'"
      />
      <div class="container">
        <PublicSearchTheFilteredCareFacilities :doubled="true" />
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
import noResults from "~/assets/images/search_no_results.jpg";

const filterStore = useFilterStore();
const breakpoints = useBreakpoints();

watch(
  () => filterStore.filterSort,
  () => {
    filterStore.loadAllResults();
  }
);

const showSearchFilter = computed(() => {
  return breakpoints.width.value > BreakPoints.md;
});

onMounted(async () => {
  filterStore.currentKinds = ["news"];
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
  display: flex
  gap: 1rem
  padding: 2rem 5rem

  @include md
    padding: 1rem

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
