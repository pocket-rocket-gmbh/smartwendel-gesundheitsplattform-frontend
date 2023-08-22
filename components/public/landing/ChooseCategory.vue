<template>
  <div class="choose-category">
    <PublicSearchField
      v-model="filterStore.currentSearchTerm"
      :filtered-items="filterStore.filteredResults"
      :default-route-to="'/public/search'"
      @update:model-value="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const filterStore = useFilterStore();

const handleInput = () => {
  filterStore.onlySearchInTitle = true;
  filterStore.loadFilteredResults();
};

onMounted(async () => {
  filterStore.currentKinds = [];
  filterStore.currentTags = [];
  filterStore.currentZip = null;
  filterStore.onlySearchInTitle = true;
  await filterStore.loadAllResults();
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main";

.choose-category {
  position: relative;
  flex-direction: row;

  @include md {
    width: 100%;
  }
}
</style>
