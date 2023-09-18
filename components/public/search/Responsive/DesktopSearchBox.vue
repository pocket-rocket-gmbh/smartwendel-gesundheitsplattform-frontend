<template>
  <div class="basic-search-box mt-6">
    <div class="content" ref="contentWrapperRef" v-resize="updatePopoverWidth">
      <v-row>
        <v-col>
          <h2 class="is-uppercase text-white">{{ subTitle }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="filterKind !== 'event' && filterKind !== 'news'">
          <div class="field general-font-size">
            <label class="label is-white">
              <div class="search-term">
                <span v-if="filterKind === 'facility'">Kategorie </span>
                <span v-else>Kategorie</span>
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
            <label class="label is-white">
              <div class="search-term">Suchbegriff</div>
            </label>
            <PublicSearchField
              v-model="filterStore.currentSearchTerm"
              :filtered-items="filterStore.filteredResults"
              :default-route-to="'/public/search'"
              :default-styling="true"
              @update:model-value="handleInput"
            />
          </div>
        </v-col>
        <v-col>
          <div class="field general-font-size">
            <label class="label is-white">Gemeinde</label>
            <div class="select-wrapper">
              <select class="input select" v-model="filterStore.currentZip">
                <option :value="null">Gemeinde auswählen</option>
                <option v-for="community in communities" :value="community.zip">
                  {{ community.name }}
                </option>
              </select>
            </div>
          </div>
        </v-col>
        <v-col class="align-end field">
          <v-btn
            class="ml-3 bordered"
            variant="flat"
            rounded="pill"
            color="white"
            @click="startSearch"
          >
            Suche starten
          </v-btn>
          <v-btn
            class="mx-3 bordered"
            variant="outlined"
            rounded="pill"
            color="white"
            @click="filterStore.clearSearch()"
          >
            Auswahl zurücksetzen
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="bottom-actions" v-if="mapControls">
        <v-col class="center">
          <v-btn
            variant="outlined"
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
</template>
<script setup lang="ts">
import { FilterKind, useFilterStore } from "~/store/searchFilter";

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

const communitiesApi = useCollectionApi();
communitiesApi.setBaseApi(usePublicApi());
communitiesApi.setEndpoint(`communities`);
const communities = communitiesApi.items;

const resetSearchTerm = () => {
  filterStore.currentSearchTerm = "";
  filterStore.loadFilteredResults();
};

const getCommunities = async () => {
  await communitiesApi.retrieveCollection();
};

onMounted(() => {
  getCommunities();
  updatePopoverWidth();
});
</script>

<style lang="sass" scoped>
@import "@/assets/sass/main.sass"
.basic-search-box
  background: linear-gradient(88.43deg, #91A80D 13.65%, #BAC323 35.37%, #9EA100 82.27%)
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
  min-height: 80px

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
</style>
