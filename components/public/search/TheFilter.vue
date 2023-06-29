<template>
  <div class="filter-sticky">
    <h2 class="is-dark-grey is-uppercase mb-4">Suche filtern</h2>
    <div class="filter-tiles">
      <div
        class="filter-tile"
        v-for="filter in mainFilters"
        :class="selectedMainFilter?.id === filter.id && 'selected'"
        @click="toggleFilter(filter)"
      >
        {{ filter.name }}
      </div>
    </div>
    <div class="sub-filter" v-if="selectedMainFilter">
      <div class="title">{{ selectedMainFilter.name }}</div>
      <PublicTagSelect :filterId="selectedMainFilter.id" />
    </div>
    <v-btn class="mt-6" variant="flat" size="large" rounded="pill" color="primary" @click="applyFilters">
      Filter anwenden
    </v-btn>
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
  </div>
</template>

<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";
import { ResultStatus } from "~/types/serverCallResult";

const filterStore = useFilterStore();
const snackbar = useSnackbar();

const api = useCollectionApi();
api.setBaseApi(usePublicApi());
api.setEndpoint("tag_categories");

const mainFilters = ref([]);

const selectedMainFilter = ref(null);

const emitResetFilter = () => {
  filterStore.clearSearch();
};

const copySearchFilterUrl = () => {
  snackbar.showSuccess("Filter in Zwischenablage gespeichert!");
  navigator.clipboard.writeText(window.location.href);
};

const applyFilters = () => {
  filterStore.loadAllResults();
};

const toggleFilter = (filter: any) => {
  selectedMainFilter.value = selectedMainFilter.value?.id === filter.id ? null : { id: filter.id, name: filter.name };
};

onMounted(async () => {
  mainFilters.value = await getMainFilters("service");
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/main.sass";

.filter-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .filter-tile {
    width: 170px;
    height: 95px;
    display: grid;
    place-items: center;
    text-align: center;
    border: 1px solid #636362;
    padding: 1.5rem 0.5rem;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover,
    &.selected {
      background-color: #d3d3d3;
    }
  }
}

.sub-filter {
  margin-top: 2rem;
}

.filter-sticky {
  position: sticky;
  top: 8rem;
}
</style>
~/store/SearchFilter
