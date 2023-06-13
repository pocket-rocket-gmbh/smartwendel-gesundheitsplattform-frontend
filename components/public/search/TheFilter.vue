<template>
  <h2 class="is-dark-grey is-uppercase mb-4">Suche filtern</h2>

  <div class="mb-4">
    <PublicFilterSelect
      :key="filterStore.currentCategoryId"
      color="is-primary"
      filter-name="category"
      label="Bereich"
      endpoint="categories"
    />
  </div>
  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!filterStore.currentCategoryId"
      :key="filterStore.currentCategoryId"
      color="is-primary"
      filter-name="subCategory"
      label="Schwerpunkt"
      :endpoint="`categories/${filterStore.currentCategoryId}/sub_categories`"
    />
  </div>

  <div class="mb-4">
    <PublicFilterSelect
      :disabled="!filterStore.currentSubCategoryId || !filterStore.currentCategoryId"
      :key="filterStore.currentSubCategoryId"
      color="is-primary"
      filter-name="subSubCategory"
      label="Schwerpunkt-Kategorie"
      :endpoint="`categories/${filterStore.currentCategoryId}/sub_categories/${filterStore.currentSubCategoryId}/sub_sub_categories`"
    />
  </div>
  <div>Weitere Auswahlmöglichkeiten</div>
  <PublicTagSelect />
  <div>
    <v-btn
      prepend-icon="mdi-trash-can-outline"
      size="small"
      class="mt-4"
      variant="text"
      color="secondary"
      rounded="pill"
      @click="emitResetFilter"
    >
      Alle Filter löschen
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();

const emitResetFilter = () => {
  filterStore.clearSearch();
};
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
