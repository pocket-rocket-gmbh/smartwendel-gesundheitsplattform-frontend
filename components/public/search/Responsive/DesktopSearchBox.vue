<template>
  <div class="basic-search-box mt-6">
    <div class="content" ref="contentWrapperRef" v-resize="updatePopoverWidth">
      <v-row>
        <v-col>
          <h2 class="is-uppercase text-white">{{ subTitle }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="align-end">
          <div class="field">
            <label class="label is-white">
              <div class="search-term">
                Suchbegriff
                <v-chip v-if="filterStore.currentSearchTerm" closable @click:close="resetSearchTerm">
                  {{ filterStore.currentSearchTerm }}
                </v-chip>
              </div>
            </label>
            <FacilityFilterSelection v-model="filterStore.currentTags" :popover-width="popoverWidth" />
          </div>
        </v-col>
        <v-col class="align-end">
          <div class="field">
            <label class="label is-white">Gemeinde</label>
            <select class="input select" v-model="filterStore.currentZip">
              <option :value="null">Keine Auswahl</option>
              <option v-for="community in communities" :value="community.zip">{{ community.name }}</option>
            </select>
          </div>
        </v-col>
        <v-col class="align-end field">
          <v-btn class="mx-3 bordered" variant="outlined" rounded="pill" color="white" @click="filterStore.clearSearch()">
            Auswahl zurücksetzen
          </v-btn>
          <v-btn class="ml-3 bordered" variant="flat" rounded="pill" color="white" @click="startSearch"> Suche starten </v-btn>
        </v-col>
      </v-row>
      <v-row class="bottom-actions" v-if="mapControls">
        <v-col class="center">
          <v-btn variant="outlined" rounded="pill" color="white" @click="emit('toggleMap')">
            <span v-if="showMap"> Karte ausblenden </span>
            <span v-if="!showMap"> Karte einblenden </span>
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFilterStore } from "~/store/searchFilter";

const props = defineProps<{
  title: string;
  subTitle: string;
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
  popoverWidth.value = contentWrapperRef.value.getBoundingClientRect().width;
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
  padding: 2rem 4rem 2rem 4rem

  @include md
    padding: 1rem

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

.center
  display: flex
  align-items: center

.bottom-actions
  min-height: 80px

.select
  cursor: pointer

.search-term
  display: flex
  align-items: center
  gap: 1rem

.bordered 
  --v-btn-height: 38px
</style>
