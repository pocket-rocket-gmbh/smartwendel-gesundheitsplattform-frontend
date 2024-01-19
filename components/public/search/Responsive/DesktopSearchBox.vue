<template>
  <div class="basic-search-box is-primary-background mt-6">
    <div class="content" ref="contentWrapperRef" v-resize="updatePopoverWidth">
      <v-row>
        <v-col class="d-flex">
          <span class="general-font-size text-h4 text-white">{{ subTitle }}</span>
          <v-btn
            v-if="useUser().isAdmin()"
            prepend-icon="mdi-content-copy"
            variant="outlined"
            rounded="pill"
            color="red darken-2"
            class="mx-5 mt-1"
            @click="copySearchFilterUrl"
          >
            Such-Filter kopieren
          </v-btn>
        </v-col>
        <v-col v-if="filterKind === 'facility'" md="2" class="d-flex justify-end">
          <v-btn
            variant="outlined"
            min-width="250px"
            max-width="250px"
            rounded="pill"
            size="large"
            color="white"
            @click="emit('toggleMap')"
            class="general-font-size"
          >
            <span v-if="showMap"> Listenansicht </span>
            <span v-else> Kartenansicht </span> 
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="field general-font-size">
            <label class="label is-white">
              <div class="search-term general-font-size">
                <p v-if="filterTitle">{{ filterTitle }}</p>
                <p v-else class="waiting general-font-size"><span>.</span><span>.</span><span>.</span></p>
              </div>
            </label>
            <FacilityFilterSelection
              v-model="filterStore.currentTags"
              :popover-width="popoverWidth"
              :filter-kind="filterKind"
            />
          </div>
        </v-col>
        <v-col>
          <div class="field general-font-size">
            <label class="label is-white general-font-size">Gemeinde</label>
            <div class="select-wrapper">
              <select
                class="input select"
                v-model="filterStore.currentZip"
                @click="handleClearTermSearch()"
              >
                <option :value="null">Gemeinde wählen</option>
                <option v-for="community in communities" :value="community.zip" class="general-font-size">
                  {{ community.name }}
                </option>
              </select>
            </div>
          </div>
        </v-col>
        <v-col md="1" class="d-flex justify-center align-end is-white mb-4">
          <div class="label font-weight-medium general-font-size">oder</div>
        </v-col>
        <v-col>
          <div class="field general-font-size">
            <label class="label is-white">
              <div class="search-term">
                <p class="general-font-size" v-if="searchTitle">{{ searchTitle }}</p>
                <p v-else class="waiting general-font-size"><span>.</span><span>.</span><span>.</span></p>
              </div>
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
        <v-col class="d-flex align-end field">
          <v-btn
            class="general-font-size"
            min-width="250px"
            max-width="250px"
            size="large"
            variant="outlined"
            rounded="pill"
            color="white"
            @click="filterStore.clearSearch()"
          >
            <span>Filter löschen</span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
  <v-row class="has-bg-darken-grey text-white">
    <v-col class="d-flex justify-center align-center bottom-actions mx-3">
      <LoadingSpinner v-if="filterStore.loading" />
      <span class="general-font-size" v-else-if="filterStore.filteredResults.length"
        >{{ filterStore.filteredResults.length }} Treffer</span
      >
      <span v-else-if="!appStore.loading">
        Leider keine Ergebnisse gefunden. Bitte passe deine Suche an.
      </span>
      <span v-else> Bitte warten... </span>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { type FilterKind, useFilterStore } from "~/store/searchFilter";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();

const snackbar = useSnackbar();

const props = defineProps<{
  title: string;
  subTitle: string;
  filterKind: FilterKind;
  mapControls?: boolean;
  showMap?: boolean;
}>();

const filterStore = useFilterStore();

const emit = defineEmits<{
  (event: "toggleMap"): void;
}>();

const contentWrapperRef = ref<HTMLDivElement>();
const popoverWidth = ref(0);

const updatePopoverWidth = () => {
  if (!contentWrapperRef.value) return;
  popoverWidth.value = contentWrapperRef.value.getBoundingClientRect().width;
};

const handleInput = () => {
  filterStore.onlySearchInTitle = false;
  filterStore.loadFilteredResults();
};

const startSearch = () => {
  filterStore.loadAllResults();
};

const handleClearTermSearch = () => {
  if (filterStore.currentSearchTerm) {
    filterStore.clearTermSearch();
  }
  return;
};

const filterTitle = ref("");
const searchTitle = ref("");
const setFilterTitle = () => {
  if (props.filterKind === "facility") {
    filterTitle.value = "Branche";
    searchTitle.value = "Anbieter suchen";
  }
};

const communities = ref<any[]>([]);

const resetSearchTerm = () => {
  filterStore.currentSearchTerm = "";
  filterStore.loadFilteredResults();
};

const copySearchFilterUrl = () => {
  snackbar.showSuccess("Filter in Zwischenablage gespeichert!");
  const url = filterStore.getUrlQuery();
  navigator.clipboard.writeText(url);
};

onMounted(async () => {
  communities.value = await filterStore.loadAllCommunities();

  updatePopoverWidth();
  setFilterTitle();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  padding: 2rem 5rem

  @include md
    padding: 1rem

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

.center
  display: flex
  align-items: center

.bottom-actions
  height: 50px

.select-wrapper
  position: relative
  display: flex
  align-items: center

  .select
    cursor: pointer

  &::after
    content: ""
    width: 20px
    height: 20px
    position: absolute
    right: 0.75rem
    background-image: url("@/assets/icons/chevron-down.svg")
    background-repeat: no-repeat
    background-position: center
    pointer-events: none

.search-term
  display: flex
  align-items: center
  gap: 1rem

.bordered
  --v-btn-height: 38px

  @keyframes blink
    0%
      opacity: .2
    20%
      opacity: 1
    100%
      opacity: .2

.waiting span
  animation-name: blink
  animation-duration: 1.4s
  animation-iteration-count: infinite
  animation-fill-mode: both


.waiting span:nth-child(2)
  animation-delay: .2s

.waiting span:nth-child(3)
  animation-delay: .4s
</style>
