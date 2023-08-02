<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox
        title="Kurse & Veranstaltungen"
        sub-title="Deine Wunschkurs auswählen"
        :filter-kind="'event'"
      />
      <v-container class="container limited padding">
        <v-row class="mt-1 row">
          <v-col v-if="showSearchFilter" md="4" lg="3" class="mt-4">
            <PublicSearchTheFilter :filterKind="'event'" />
          </v-col>
          <v-col md="8" lg="9" class="filtered-items">
            <PublicSearchTheFilteredCareFacilities />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useBreakpoints, BreakPoints } from "~/composables/ui/breakPoints";
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
  filterStore.currentKinds = ["event", "course"];
  filterStore.updateFromUrlQuery();
  filterStore.loadAllResults();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"

.container
  padding: 0

  .row
    max-width: 100%
    margin: 0
    @include md
      margin: 0


.filtered-items
  display: flex
  justify-content: center
  margin-top: 1rem

  @include md
    padding: 0
</style>
