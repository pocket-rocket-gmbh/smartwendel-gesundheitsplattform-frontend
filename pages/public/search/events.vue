<template>
  <ClientOnly>
    <div>
      <PublicSearchTheBasicSearchBox title="Kurse & Veranstaltungen" sub-title="Wählen sie ihren Wunschkurs" />
      <v-container class="container limited padding">
        <v-row class="mt-1">
          <v-col md="4" lg="3" class="mt-4">
            <PublicSearchTheFilter />
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

const filterStore = useFilterStore();

watch(
  () => filterStore.filterSort,
  () => {
    filterStore.loadAllResults();
  }
);

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
//   margin: 60px

.filtered-items
  display: flex
  justify-content: flex-end
</style>
