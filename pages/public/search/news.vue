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
</style>
