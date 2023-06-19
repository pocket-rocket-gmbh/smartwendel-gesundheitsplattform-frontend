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

    <v-btn
      prepend-icon="mdi-content-copy"
      size="small"
      class="mt-4"
      variant="text"
      color="primary"
      rounded="pill"
      @click="copySearchFilterUrl"
    >
      Such-Filter kopieren
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/facilitySearchFilter";

const filterStore = useFilterStore();
const snackbar = useSnackbar();

const emitResetFilter = () => {
  filterStore.clearSearch();
};

const copySearchFilterUrl = () => {
  snackbar.showSuccess("Filter in Zwischenablage gespeichert!");
  navigator.clipboard.writeText(window.location.href);
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
</style>
