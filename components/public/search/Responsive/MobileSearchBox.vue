<template>
  <div class="basic-search-box">
    <div class="content">
      <v-row no-gutters>
        <v-col>
          <h3 class="is-uppercase text-white">{{ subTitle }}</h3>
        </v-col>
        <div class="filter-container">
          <span class="is-white counter">{{ countSelectedFilters }}</span>
        </div>
        <v-col cols="3" md="3" sm="3" class="d-flex justify-end align-center">
          <v-icon
            color="white"
            size="x-large"
            v-if="showFilter"
            @click="toogleShowFilter()"
            >mdi-filter-off-outline</v-icon
          >
          <v-icon
            color="white"
            size="x-large"
            v-if="!showFilter && !filterStore.mapFilter?.length"
            @click="toogleShowFilter()"
            >mdi-filter-outline</v-icon
          >
          <v-icon
            color="white"
            size="x-large"
            v-if="!showFilter && filterStore.mapFilter?.length"
            @click="handleClearSearch()"
            >mdi-close-outline</v-icon
          >
        </v-col>
      </v-row>
      <div v-show="showFilter">
        <v-row v-if="filterKind !== 'event' && filterKind !== 'news'">
          <v-col cols="10">
            <PublicSearchCategorySelectModal
              v-model="filterStore.currentFacilityTags"
              :filter-kind="filterKind"
              :filterTitle="filterTitle"
            />
          </v-col>
          <v-col>
            <PublicSearchFilterSelectModal :filter-kind="filterKind" />
          </v-col>
        </v-row>
        <v-row v-if="filterKind !== 'event' && filterKind !== 'news'">
          <v-col class="d-flex align-center">
            <PublicSearchCommunitySelectModal />
          </v-col>
        </v-row>
        <div
          class="d-flex align-center justify-center is-white font-weight-medium my-2"
          v-if="filterKind !== 'event' && filterKind !== 'news'"
        >
          oder
        </div>
        <v-row
          :class="[
            filterKind === 'event' || filterKind === 'news' ? 'mt-5' : '',
          ]"
        >
          <v-col>
            <div class="field">
              <label class="label is-white">
                <div class="search-term">{{ searchTitle }}</div>
              </label>
              <PublicSearchField
                v-model="filterStore.currentSearchTerm"
                :filtered-items="filterStore.filteredResults"
                :default-route-to="'/public/search'"
                :default-styling="true"
                @update:model-value="handleInput"
                :kind="filterKind"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="buttons">
          <v-col class="field d-flex justify-center">
            <v-btn
              variant="outlined"
              width="100%"
              rounded="pill"
              color="white"
              @click="filterStore.clearSearch()"
            >
              Filter löschen
            </v-btn>
          </v-col>
          <v-col class="d-flex justify-center" v-if="mapControls">
            <v-btn
              variant="outlined"
              width="100%"
              rounded="pill"
              color="white"
              @click="emit('toggleMap')"
            >
              <span v-if="showMap"> Listenansicht </span>
              <span v-if="!showMap"> Kartenansicht </span>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
  <v-row class="has-bg-darken-grey text-white pa-0 ma-0">
    <v-col class="d-flex justify-center align-center bottom-actions">
      <LoadingSpinner v-if="filterStore.loading" />
      <span
        class="general-font-size"
        v-else-if="filterStore.filteredResults.length"
        >{{ filterStore.filteredResults.length }}
        <span v-if="filterStore.currentKinds.includes('facility')">
          Anbieter
        </span>
        <span v-else-if="filterStore.currentKinds.includes('event')">
          <span v-if="filterStore.filteredResults.length === 1"
            >Veranstaltung</span
          >
          <span v-else>Veranstaltungen</span>
        </span>
        <span v-else-if="filterStore.currentKinds.includes('news')">
          <span v-if="filterStore.filteredResults.length === 1">Beitrag</span>
          <span v-else>Beiträge</span>
        </span>
        <span v-else-if="filterStore.currentKinds.includes('course')">
          <span v-if="filterStore.filteredResults.length === 1">Kurs</span>
          <span v-else>Kurse</span>
        </span>
      </span>
      <span class="general-font-size" v-else-if="!appStore.loading">
        Leider keine Ergebnisse gefunden. Bitte passe deine Suche an.
      </span>
      <span v-else> Bitte warten... </span>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { type FilterKind, useFilterStore } from "~/store/searchFilter";
import { useBreakpoints } from "~/composables/ui/breakPoints";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

const props = defineProps<{
  title: string;
  subTitle: string;
  filterKind: FilterKind;
  mapControls?: boolean;
  showMap?: boolean;
}>();

const emit = defineEmits<{
  (event: "toggleMap"): void;
}>();

const filterStore = useFilterStore();
const showFilter = ref(true);
const breakpoints = useBreakpoints();

const handleInput = () => {
  filterStore.onlySearchInTitle = false;
  filterStore.loadAllResults();
};

const countSelectedFilters = computed(() => {
  let results = 0;
  if (filterStore.currentSearchTerm.length) {
    results += 1;
  }
  if (filterStore.currentServiceTags.length) {
    results += filterStore.currentServiceTags.length;
  }
  if (filterStore.currentZips) {
    results += filterStore.currentZips.length;
  }
  if (filterStore.currentFacilityTags.length) {
    results += filterStore.currentFacilityTags.length;
  }
  return results;
});

const filterTitle = ref("");
const searchTitle = ref("");
const setFilterTitle = () => {
  if (props.filterKind === "facility") {
    filterTitle.value = "Branche";
    searchTitle.value = "Anbieter suchen";
  }
  if (props.filterKind === "event") {
    filterTitle.value = "Suche nach Veranstaltungen";
    searchTitle.value = "Veranstaltung suchen";
  }
  if (props.filterKind === "news") {
    filterTitle.value = "Suche nach Neuigkeiten";
    searchTitle.value = "Nachrichten suchen";
  }
  if (props.filterKind === "course") {
    filterTitle.value = "Themengebiet";
    searchTitle.value = "Kurs suchen";
  }
};

const handleClearSearch = () => {
  filterStore.clearSearch();
  showFilter.value = false;
  emit("toggleMap");
};

const toogleShowFilter = () => {
  showFilter.value = !showFilter.value;
};

watch(
  () => props.showMap,
  () => {
    showFilter.value = false;
  },
  {
    deep: true,
  }
);


const isMobilie = computed(() => {
  if (breakpoints.type.value === "sm" || breakpoints.type.value === "xs") {
    return true;
  }
  return false;
});

onMounted(() => {
  setFilterTitle();
  if (isMobilie.value) {
    showFilter.value = false;
  }
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  background: linear-gradient(88.43deg, #91A80D 13.65%, #BAC323 35.37%, #9EA100 82.27%)
  padding: 1rem

  .more-filters
    display: flex
    align-items: center
    justify-content: space-between

  .v-row
    margin: 0
    gap: 0.5rem

  .v-col
    padding: 0

  .search-button
    display: flex

    .v-btn
      flex: 1

  .buttons
    margin-top: 1.5rem

.content
  max-width: 1500px
  margin: 0 auto


.filter-container
  display: flex
  align-items: center
  position: absolute
  right: 0
  margin-right: 1rem
  @include xs
    margin-right: 10px
    margin-top: -3px
  @include md
    margin-right: 10px
  .counter
    color: #8ab61d
    font-size: 12px
    background-color: #ffffff
    padding: 3px 8px
    border-radius: 50%
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)


.align-end
  display: flex
  align-items: flex-end
  justify-content: flex-end

.title
  text-transform: uppercase
  font-size: 3rem
  text-align: center
  color: white

.no-entries
  background-color: #636362
  color: white
  padding: 1rem 1.5rem
  border-radius: 2rem
  width: fit-content
  margin-left: auto

  &.solo
    margin-left: unset
    width: 100%

.select
  cursor: pointer

.search-term
  display: flex
  align-items: center
  gap: 1rem

.filter-icon
  width: 40px
</style>
