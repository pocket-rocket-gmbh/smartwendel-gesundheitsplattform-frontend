<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Veranstaltungen"
        sub-title="Deine Wunschveranstaltung auswählen"
        :filter-kind="'event'"
      />
      <div class="container">
        <div class="results">
          <PublicSearchTheFilteredCareFacilities />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";
import { useFilterStore } from "~/store/searchFilter";

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
</style>
