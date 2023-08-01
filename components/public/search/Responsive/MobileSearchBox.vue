<template>
  <div class="basic-search-box">
    <div class="content">
      <v-row>
        <v-col>
          <h2 class="is-uppercase text-white">{{ subTitle }}</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="align-end">
          <PublicSearchCategorySelectModal v-model="filterStore.currentTags" />
        </v-col>
      </v-row>
      <v-row>
        <v-col class="align-end">
          <PublicSearchCommunitySelectModal />
        </v-col>
        <v-col class="align-end">
          <PublicSearchFilterSelectModal :filter-kind="filterKind" />
        </v-col>
      </v-row>
      <v-row class="buttons">
        <v-col class="field">
          <v-btn variant="outlined" rounded="pill" color="white" @click="filterStore.clearSearch()">
            Auswahl zurücksetzen
          </v-btn>
        </v-col>
        <v-col class="field search-button">
          <v-btn variant="flat" rounded="pill" color="white" @click="startSearch"> Suche starten </v-btn>
        </v-col>
      </v-row>

      <v-row v-if="mapControls" class="bottom-actions">
        <v-col class="center">
          <v-btn variant="outlined" size="large" rounded="pill" color="white" @click="emit('toggleMap')">
            <span v-if="showMap"> Karte ausblenden </span>
            <span v-if="!showMap"> Karte einblenden </span>
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

const startSearch = () => {
  filterStore.loadAllResults();
};
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
</style>
