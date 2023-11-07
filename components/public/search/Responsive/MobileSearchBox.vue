<template>
  <div class="basic-search-box">
    <div class="content">
      <v-row>
        <v-col>
          <h2 class="is-uppercase text-white">{{ subTitle }}</h2>
        </v-col>
        <v-col cols="2" class="d-flex justify-center align-center">
          <v-icon color="white" size="x-large" @click="toogleShowFilter()"
            >mdi-filter-outline</v-icon
          >
        </v-col>
      </v-row>
      <div v-if="showFilter">
        <v-row>
          <v-col>
            <div class="field">
              <label class="label is-white">
                <div class="search-term">Anbieter suchen</div>
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
        <div class="d-flex align-center justify-center is-white font-weight-medium my-2">
          oder
        </div>
        <v-row v-if="filterKind !== 'event' && filterKind !== 'news'">
          <v-col>
            <PublicSearchCategorySelectModal
              v-model="filterStore.currentTags"
              :filter-kind="filterKind"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="d-flex align-center">
            <PublicSearchCommunitySelectModal />
          </v-col>
          <v-col class="" v-if="filterKind !== 'event' && filterKind !== 'news'">
            <PublicSearchFilterSelectModal :filter-kind="filterKind" />
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
  <v-row class="has-bg-darken-grey text-white font-weight-bold ma-0 pa-0">
    <v-col class="d-flex justify-center align-center general-font-size">
      <LoadingSpinner v-if="filterStore.loading" />
      <span v-else-if="filterStore.filteredResults.length"
        >{{ filterStore.filteredResults.length }} Treffer</span
      >
      <span v-else> Leider keine Ergebnisse gefunden. Bitte passe deine Suche an. </span>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { FilterKind, useFilterStore } from "~/store/searchFilter";
import { BreakPoints, useBreakpoints } from "~/composables/ui/breakPoints";

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
  filterStore.loadFilteredResults();
};

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

const toogleShowFilter = () => {
  showFilter.value = !showFilter.value;
};

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
