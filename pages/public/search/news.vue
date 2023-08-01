<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox title="Beiträge" sub-title="Deine Wunschbeitrag auswählen" :filter-kind="'news'" />
      <v-container class="container limited padding">
        <v-row class="row mt-1">
          <v-col v-if="showSearchFilter" md="4" lg="3" class="mt-4">
            <PublicSearchTheFilter :filterKind="'news'" />
          </v-col>
          <v-col md="8" lg="9" class="filtered-items mb-10">
            <PublicSearchTheFilteredCareFacilities />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import { useBreakpoints, BreakPoints } from "~/composables/ui/breakPoints";

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
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 0

  .row
    @include md
      max-width: 100%
      margin: 0

.filtered-items
  display: flex
  justify-content: center
  margin-top: 1rem

  @include md
    padding: 0
</style>
